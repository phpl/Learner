import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IUserProgress, defaultValue } from 'app/shared/model/user-progress.model';

export const ACTION_TYPES = {
  FETCH_USERPROGRESS_LIST: 'userProgress/FETCH_USERPROGRESS_LIST',
  FETCH_USERPROGRESS: 'userProgress/FETCH_USERPROGRESS',
  CREATE_USERPROGRESS: 'userProgress/CREATE_USERPROGRESS',
  UPDATE_USERPROGRESS: 'userProgress/UPDATE_USERPROGRESS',
  DELETE_USERPROGRESS: 'userProgress/DELETE_USERPROGRESS',
  RESET: 'userProgress/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IUserProgress>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type UserProgressState = Readonly<typeof initialState>;

// Reducer

export default (state: UserProgressState = initialState, action): UserProgressState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERPROGRESS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_USERPROGRESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_USERPROGRESS):
    case REQUEST(ACTION_TYPES.UPDATE_USERPROGRESS):
    case REQUEST(ACTION_TYPES.DELETE_USERPROGRESS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_USERPROGRESS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_USERPROGRESS):
    case FAILURE(ACTION_TYPES.CREATE_USERPROGRESS):
    case FAILURE(ACTION_TYPES.UPDATE_USERPROGRESS):
    case FAILURE(ACTION_TYPES.DELETE_USERPROGRESS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERPROGRESS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_USERPROGRESS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_USERPROGRESS):
    case SUCCESS(ACTION_TYPES.UPDATE_USERPROGRESS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_USERPROGRESS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/user-progresses';

// Actions

export const getEntities: ICrudGetAllAction<IUserProgress> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_USERPROGRESS_LIST,
  payload: axios.get<IUserProgress>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IUserProgress> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_USERPROGRESS,
    payload: axios.get<IUserProgress>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IUserProgress> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USERPROGRESS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IUserProgress> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USERPROGRESS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IUserProgress> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USERPROGRESS,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
