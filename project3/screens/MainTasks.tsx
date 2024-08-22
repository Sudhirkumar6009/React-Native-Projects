import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View, FlatList, Button, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface MainTasksProps {
  navigation?: any;
}

const MainTasks = ({ navigation = null }: MainTasksProps) => {
  const [isTagModalVisible, setIsTagModalVisible] = useState(false);
  const openTagModal = () => setIsTagModalVisible(true);
  const closeTagModal = () => setIsTagModalVisible(false);

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [desc, setDesc] = useState('');
  const [title, setTitle] = useState('');
  const [fontColor, setFontColor] = useState('black');
  const [tasks, setTasks] = useState<{ title: string, desc: string, fontColor: string, date: string | null, time: string | null}[]>([]);
  const [isFlagModalVisible, setIsFlagModalVisible] = useState(false);
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);

  // Date & Time picker states
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [selectedTask, setSelectedTask] = useState<{
    title: string;
    desc: string;
    fontColor: string;
    date: string | null;
    time: string | null;
  } | null>(null);
  

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    const formattedTime = time.toLocaleTimeString();
    setSelectedTime(formattedTime);
    hideTimePicker();
  };

  const deleteTask = async (index: number) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const updatedTasks = tasks.filter((_, i) => i !== index);
            setTasks(updatedTasks);
            await saveTasks(updatedTasks);
          },
        },
      ],
    );
  };

  const flags = [
    { id: '1', text: 'Priority 1' },
    { id: '2', text: 'Priority 2' },
    { id: '3', text: 'Priority 3' },
    { id: '4', text: 'Priority 4' },
    { id: '5', text: 'Priority 5' },
    { id: '6', text: 'Priority 6' },
  ];

  const colors = ['blue', 'green', 'red', 'purple', 'orange', 'cyan'];

  const handlePress = (id: string) => {
    setSelectedFlagId(prevId => (prevId === id ? null : id));
    console.log(`Flag ${id} selected`);
  };

  const renderItem = ({ item }: { item: { id: string; text: string } }) => {
    const index = parseInt(item.id, 10) - 1;
    const color = colors[index];
    const isSelected = selectedFlagId === item.id;

    return (
      <>
        <View style={{ paddingStart: 15, paddingEnd: 15, paddingTop: 10, paddingBottom: 13, flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ fontSize: 18, color: 'black', letterSpacing: 1 }}>{item.text}</Text>
          <View style={{ marginEnd: 10, flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => handlePress(item.id)}>
              <Icon
                name={isSelected ? 'checkmark-circle' : 'close-circle-sharp'}
                size={30}
                color={isSelected ? color : '#cccccc'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 0.7, backgroundColor: 'black', marginStart: 10, marginEnd: 10, opacity: 0.1 }} />
      </>
    );
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const toggleModal = () => {
    setIsAddTaskModalVisible(!isAddTaskModalVisible);
    setSelectedDate(null);
    setSelectedTime(null);
    setFontColor('');
    setSelectedFlagId(null);
    setTitle('');
    setDesc('');
  };

  const toggleFlagModal = () => {
    setIsFlagModalVisible(!isFlagModalVisible);
  };

  const resetDate = () => {
    setSelectedDate(null);
  };

  const resetTime = () => {
    setSelectedTime(null);
  }

  const addTask = async () => {
    if (title && desc) {
      const flagColor = selectedFlagId ? colors[parseInt(selectedFlagId, 10) - 1] : '';
      const newTask = { title, desc, fontColor: flagColor, date: selectedDate, time: selectedTime};
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      setTitle('');
      setDesc('');
      setSelectedFlagId(null);
      setSelectedDate(null);
      setSelectedTime(null);
      toggleModal();
    } else {
      Alert.alert('Error', 'Please enter both title and description.');
    }
  };
  
  
  const updateTask = async () => {
    if (selectedTaskIndex !== null && title && desc) {
      const flagColor = selectedFlagId ? colors[parseInt(selectedFlagId, 10) - 1] : '';
      const updatedTasks = tasks.map((task, index) =>
        index === selectedTaskIndex ? { ...task, title, desc, fontColor: flagColor, date: selectedDate, time: selectedTime } : task
      );
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
      setTitle('');
      setDesc('');
      setSelectedFlagId(null);
      setSelectedTaskIndex(null);
      setIsEditTaskModalVisible(false);
    } else {
      Alert.alert('Error', 'Please enter both title and description.');
    }
  };

  const toggleEditTaskModal = (index: number) => {
    setSelectedTaskIndex(index);
    if (index !== null && tasks[index]) {
      setTitle(tasks[index].title);
      setDesc(tasks[index].desc);
      setFontColor(tasks[index].fontColor);
      setSelectedDate(tasks[index].date);
      setSelectedTime(tasks[index].time);
    }
    setIsEditTaskModalVisible(!isEditTaskModalVisible);
    setSelectedDate(null);
    setSelectedTime(null);
    setFontColor('');
    setSelectedFlagId(null);
    setTitle('');
    setDesc('');
  };

  const saveTasks = async (tasksToSave: { title: string, desc: string, fontColor: string, date: string | null, time: string | null }[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksToSave));
    } catch (e) {
      console.error('Failed to save tasks.', e);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (e) {
      console.error('Failed to load tasks.', e);
    }
  };

  const handleCardPress = (task: {
    title: string;
    desc: string;
    fontColor: string;
    date: string | null;
    time: string | null;
  }) => {
    setSelectedTask(task);
  };

  const priorityDisplay = ({ item }: { item: { fontColor: string | null } }) => {
    let text;
    switch (item.fontColor) {
      case 'blue':
        text = 'Priority 1';
        break;
      case 'green':
        text = 'Priority 2';
        break;
      case 'red':
        text = 'Priority 3';
        break;
      case 'purple':
        text = 'Priority 4';
        break;
      case 'orange':
        text = 'Priority 5';
        break;
      case 'cyan':
        text = 'Priority 6';
        break;
      default:
        text = '';
        break;
    }
    return text;
  };
  

  const renderTaskItem = ({ item, index }: { item: { title: string; desc: string; fontColor: string, date: string | null, time: string | null}; index: number }) => (
      <View style={styles.taskCard}>
        <View>
          <TouchableOpacity style={{height:120, width:352,position:'absolute',backgroundColor:'transparent',borderRadius:10,top:-15,start:-15,}} onPress={() => handleCardPress(item)} />
          <Text style={[styles.taskTitle, { color: 'black' }]}>{item.title}</Text>
          <Text style={[styles.taskDesc, { color: 'black' }]}>{item.desc}</Text>
          {item.date && item.time ? (
            <>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: 10}}>
                  <Image
                    source={require('../assets/picture2.png')}
                    style={{height: 30, width: 105, start: -20, bottom: -20}}
                  />
                  <Text style={{bottom: 5, start: -10, color: 'white', letterSpacing: 0.8, fontWeight: '500'}}>
                    Due Date
                  </Text>
                </View>
                <View style={{backgroundColor: 'white', height: 40, marginTop: 10}}>
                  <Text style={[styles.taskDesc, {color: 'black', fontWeight: '400', letterSpacing: 0.6, top: 10, end: 10}]}>
                    {item.date}
                  </Text>
                  <Text style={[styles.taskDesc, {color: 'black', fontWeight: '400', letterSpacing: 0.6, top: 10, end: 10}]}>
                    {item.time}
                  </Text>
                </View>
              </View>
            </>
          ) : item.date && !item.time ? (
            <>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: 10}}>
                  <Image
                    source={require('../assets/picture2.png')}
                    style={{height: 30, width: 105, start: -20, bottom: -20}}
                  />
                  <Text style={{bottom: 5, start: -10, color: 'white', letterSpacing: 0.8, fontWeight: '500'}}>
                    Due Date
                  </Text>
                </View>
                <View style={{backgroundColor: 'white', height: 40, marginTop: 10}}>
                  <Text style={[styles.taskDesc, {color: 'black', fontWeight: '400', letterSpacing: 0.6, top: 20, end: 10}]}>
                    {item.date}
                  </Text>
                </View>
              </View>
            </>
          ) : !item.date && item.time ? (
            <>
              <View style={{flexDirection: 'row'}}>
                <View style={{marginTop: 10}}>
                  <Image
                    source={require('../assets/picture2.png')}
                    style={{height: 30, width: 105, start: -20, bottom: -20}}
                  />
                  <Text style={{bottom: 5, start: -10, color: 'white', letterSpacing: 0.8, fontWeight: '500'}}>
                    Due Time
                  </Text>
                </View>
                <View style={{backgroundColor: 'white', height: 40, marginTop: 10}}>
                  <Text style={[styles.taskDesc, {color: 'black', fontWeight: '400', letterSpacing: 0.6, top: 20, end: 10}]}>
                    {item.time}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.taskDesc}></Text>
              <Text style={styles.taskDesc}></Text>
            </>
          )}


        </View>
        <View style={styles.taskActions}>
          {item.fontColor && (
            <View style={{flexDirection:'column',alignSelf:'flex-end',bottom:30, marginEnd:40 }}>
              <Icon2 name='flag' size={25} color={item.fontColor} style={styles.flagDesign}/>
              <Text style={{fontWeight:'500',color:'black'}}>{priorityDisplay({ item })}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => toggleEditTaskModal(index)} style={styles.editDesign}>
            <Icon2 name="edit" size={18} color={'black'} style={{bottom:5,start:5}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(index)} style={styles.trashDesign}>
            <Icon2 name="trash" size={18} color={'white'} style={{top:5,start:5}}/>
          </TouchableOpacity>
        </View>
      </View>
  );
  
  
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
      </View>
      
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.taskList}
      />
  
      {/* Floating Action Button */}
      <TouchableOpacity onPress={toggleModal} style={styles.floatingButtonContainer}>
        <Icon name="add" size={28} color="#1E90FF" />
      </TouchableOpacity>

      {/* Task Information Modal */}
      <Modal isVisible={selectedTask !== null} onBackdropPress={() => setSelectedTask(null)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Task Details</Text>
          {selectedTask && (
            <>
            <View style={{flexDirection:'row'}}>
              <View style={{backgroundColor:'#004d99',padding:15,width:75, borderTopStartRadius:20,borderBottomStartRadius:20}}><Text style={{color:'white',marginStart:5, fontWeight:'900'}}>TITLE</Text></View>
                <View style={{backgroundColor:'#1E90FF',padding:15, borderTopEndRadius:20,borderBottomEndRadius:20,}}>
                  <Text style={{color:'white',marginStart:5,maxWidth:210, marginEnd:5}}>{selectedTask.title}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',marginTop:10,}}>
              <View style={{backgroundColor:'#004d99',padding:15,width:130, borderTopStartRadius:20,borderBottomStartRadius:20}}><Text style={{color:'white',marginStart:5, fontWeight:'900'}}>DESCRIPTION</Text></View>
                <View style={{backgroundColor:'#1E90FF',padding:15, borderTopEndRadius:20,borderBottomEndRadius:20,}}>
                  <Text style={{color:'white',marginStart:5,maxWidth:150, marginEnd:5}}>{selectedTask.desc}</Text>
                </View>
            </View>
            <View style={{flexDirection:'row',marginBottom:15}}>
            {selectedTask.time && selectedTask.date && (
                <View style={{backgroundColor:'#800080',width:125,height:100,alignContent:'center',justifyContent:'center',marginTop:10,borderRadius:20}}>
                  <Text style={{alignSelf:'center',color:'white', marginBottom:5,fontWeight:'800',letterSpacing:1,}}>Due Date</Text>
                  <View style={{backgroundColor:'white',marginStart:15,marginEnd:15, height:1}}/>
                  <Text style={styles.timeDateInfo}>{selectedTask.date ? `Date: ${selectedTask.date}` : ''}</Text>
                  <Text style={styles.timeDateInfo}>{selectedTask.time ? `Time: ${selectedTask.time}` : ''}</Text>
                </View>
              )}     
              {selectedTask.date && !selectedTask.time && (
                <View style={{backgroundColor:'#800080',width:125,height:100,alignContent:'center',justifyContent:'center',marginTop:10,borderRadius:20}}>
                  <Text style={{alignSelf:'center',color:'white', marginBottom:5,fontWeight:'800',letterSpacing:1,}}>Due Date</Text>
                  <View style={{backgroundColor:'white',marginStart:15,marginEnd:15, height:1}}/>
                  <Text style={styles.timeDateInfo}>{selectedTask.date ? `Date: ${selectedTask.date}` : ''}</Text>
                </View>
              )}
              {selectedTask.time && !selectedTask.date && (
                <View style={{backgroundColor:'#800080',width:125,height:100,alignContent:'center',justifyContent:'center',marginTop:10,borderRadius:20}}>
                  <Text style={{alignSelf:'center',color:'white', marginBottom:5,fontWeight:'800',letterSpacing:1,}}>Due Time</Text>
                  <View style={{backgroundColor:'white',marginStart:15,marginEnd:15, height:1}}/>
                  <Text style={styles.timeDateInfo}>{selectedTask.time ? `Date: ${selectedTask.time}` : ''}</Text>
                </View>
              )}              
              {!selectedFlagId && selectedTask.fontColor && (
                <View style={{backgroundColor:'white', margin:30,}}>
                  <Icon2 name='flag' size={25} color={selectedTask.fontColor} style={{marginStart:20,marginBottom:5}}/>
                  <Text style={{fontWeight:'800', color:'black',letterSpacing:0.5,}}>{priorityDisplay({ item: selectedTask })}</Text>
                </View>
              )}
            </View>
            </>
          )}
          <Button title="Close" onPress={() => setSelectedTask(null)} />
        </View>
      </Modal>


      <Modal isVisible={isAddTaskModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>ADD TASK</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
          />
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{selectedDate ? `Date: ${selectedDate}` : 'Select Date'}</Text>
            {
              selectedDate && (
                <Icon name='close-circle' size={20} style={{paddingStart:5}} color={'red'} onPress={resetDate}/>
              )
            }
          </TouchableOpacity>
          <TouchableOpacity onPress={showTimePicker} style={styles.timePickerButton}>
            <Text style={styles.datePickerText}>{selectedTime ? `Time: ${selectedTime}` : 'Select Time'}</Text>
            {
              selectedTime && (
                <Icon name='close-circle' size={20} style={{paddingStart:5}} color={'red'} onPress={resetTime}/>
              )
            }
          </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleFlagModal} style={styles.selectFlagButton}>
            <Text style={styles.selectFlagText}>{selectedFlagId ? `Flag: ${flags[parseInt(selectedFlagId, 10) - 1].text}` : 'Select Flag'}</Text>
          </TouchableOpacity>
          <Button title="Add Task" onPress={addTask} />
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isVisible={isEditTaskModalVisible} onBackdropPress={() => setIsEditTaskModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={desc}
            onChangeText={setDesc}
          />
          <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{selectedDate ? `Date: ${selectedDate}` : 'Select Date'}</Text>
            {
              selectedDate && (
                <Icon name='close-circle' size={20} style={{paddingStart:5}} color={'red'} onPress={resetDate}/>
              )
            }
          </TouchableOpacity>
          
          <TouchableOpacity onPress={showTimePicker} style={styles.timePickerButton}>
            <Text style={styles.timePickerText}>{selectedTime ? `Time: ${selectedTime}` : 'Select Time'}</Text>
            {
              selectedTime && (
                <Icon name='close-circle' size={20} style={{paddingStart:5}} color={'red'} onPress={resetTime}/>
              )
            }
          </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={toggleFlagModal} style={styles.selectFlagButton}>
            <Text style={styles.selectFlagText}>{selectedFlagId ? `Flag: ${flags[parseInt(selectedFlagId, 10) - 1].text}` : 'Select Flag'}</Text>
          </TouchableOpacity>
          <Button title="Update Task" onPress={updateTask} />
        </View>
      </Modal>

      {/* Flag Selection Modal */}
      <Modal isVisible={isFlagModalVisible} onBackdropPress={toggleFlagModal}>
        <View style={styles.modalContainer}>
          <FlatList
            data={flags}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flagList}
          />
          <Button title="Close" onPress={toggleFlagModal} />
        </View>
      </Modal>

      {/* Date & Time Picker Modals */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />
    </View>
  );
};

export default MainTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1E90FF',
    borderBottomEndRadius:20,
    borderBottomStartRadius:20,
    elevation: 5,
    shadowColor:'white'
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight:'700',
    letterSpacing:3,
  },
  taskList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection:'row',
    backgroundColor: 'white',
    padding: 15,
    marginTop:10,
    marginStart:10,
    marginEnd:10,
    borderRadius: 10,
    elevation: 10,
    shadowColor:'#1E90FF',
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing:0.5,
  },
  taskDesc: {
    fontSize: 13,
    marginTop: 5,
    fontWeight:'300',
    letterSpacing:0.4,
  },
  timeDateInfo: {
    fontSize: 13,
    marginTop: 5,
    fontWeight:'400',
    letterSpacing:0.4,
    alignSelf:'center',
    color:'white'
  },
  taskActions: {
    flex:1,
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf:'center',
    color:'black',
    letterSpacing:1
  },
  input: {
    borderWidth: 1,
    borderColor: '#1e90ff',
    borderRadius: 5,
    paddingStart: 15,
    marginBottom: 20,
    alignItems:'center',
  },
  datePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection:'row',
    alignSelf:'center',
  },
  datePickerText: {
    color: 'black',
  },
  timePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginStart:10,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection:'row',
  },
  timePickerText: {
    color: 'black',
  },
  selectFlagButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  selectFlagText: {
    color: 'black',
  },
  flagList: {
    paddingBottom: 20,
  },
  trashDesign:{
    position:'absolute',
    backgroundColor:'red',
    padding:15,
    right:-15,
    bottom:-15,
    borderBottomRightRadius:10,
    borderTopLeftRadius:100,
    elevation:10,
    shadowColor:'#800000',
  },
  editDesign:{
    position:'absolute',
    backgroundColor:'#e4e6e7',
    padding:15,
    top:-28,
    right:-18,
    borderBottomLeftRadius:100,
    borderTopRightRadius:10,
    elevation:10,
    shadowColor:'#6C757D'
  },
  flagDesign:{
    paddingStart:20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'white',
    borderWidth:0.7,
    borderColor:'#1e90ff',
    borderRadius: 50,
    padding: 15,
    elevation: 10,
    shadowColor:'#1e90ff'
  }
});
