import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import {takeEvery, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';

// Redux
import { createStore, combineReducers, applyMiddleware } from 'redux';

const sagaMiddleware = createSagaMiddleware();


// all the students from the DB
const studentList = (state = [], action) => {
    if(action.type === 'SET_STUDENT_LIST') {
        return action.payload;
    }

    return state;
}

// hold only the single student object being edited
const editStudent = (state  = {}, action) => {

    return state;
}

function* fetchStudents() {
    try {
        const response = yield axios.get('/api/students')
        yield put({ type: 'SET_STUDENT_LIST', payload: response.data })
    } catch (err) {
        console.log(err)
    }
}

function* addStudent(action) {
    try {
        yield axios.post('/api/students', action.payload)
        yield put({ type: 'FETCH_STUDENTS' })
    } catch (err) {
        console.log(err)
    }
}





function* rootSaga() {
    yield takeLatest('FETCH_STUDENTS', fetchStudents);
    yield takeLatest('ADD_STUDENT', addStudent);
}

// The store is the big JavaScript Object that holds all of the information for our application
const store = createStore(
    combineReducers({
        studentList,
        editStudent
    }),
    applyMiddleware(sagaMiddleware, logger),
);

sagaMiddleware.run(rootSaga);

export default store;