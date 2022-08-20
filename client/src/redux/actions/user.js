import axios from 'axios'
import { GET_ALL_USERS, CREATE_USER, DELETE_USER, MODIFY_USER, GET_USER } from './actionTypes'

/// ////////////////////////////////////////////////////////////////////////////////////////////

export function getUser (username) {
  return async function (dispatch) {
    const response = await axios(`http://localhost:3001/user?username=${username}`)
    dispatch({ type: GET_USER, payload: response.data })
  }
}

export function getAllUsers () {
  return async function (dispatch) {
    const response = await axios('http://localhost:3001/user')
    dispatch({ type: GET_ALL_USERS, payload: response.data })
  }
}

export function createUser (user) {
  return async function (dispatch) {
    const response = await axios.post('http://localhost:3001/user', user)
    dispatch({ type: CREATE_USER, payload: response.data })
  }
}

export function modifyUser (id, property) {
  return async function (dispatch) {
    const response = await axios.post(`http://localhost:3001/user/${id}`, property)
    dispatch({ type: MODIFY_USER, payload: response.data })
  }
}

export function deleteUser (id) {
  return async function (dispatch) {
    const response = await axios.delete(`http://localhost:3001/user?id=${id}`)
    dispatch({ type: DELETE_USER, payload: response.data })
  }
}
