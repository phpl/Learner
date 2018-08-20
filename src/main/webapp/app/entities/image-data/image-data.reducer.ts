import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IImageData, defaultValue } from 'app/shared/model/image-data.model';

export const ACTION_TYPES = {
  FETCH_IMAGEDATA_LIST: 'imageData/FETCH_IMAGEDATA_LIST',
  FETCH_IMAGEDATA: 'imageData/FETCH_IMAGEDATA',
  CREATE_IMAGEDATA: 'imageData/CREATE_IMAGEDATA',
  UPDATE_IMAGEDATA: 'imageData/UPDATE_IMAGEDATA',
  DELETE_IMAGEDATA: 'imageData/DELETE_IMAGEDATA',
  SET_BLOB: 'imageData/SET_BLOB',
  RESET: 'imageData/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IImageData>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ImageDataState = Readonly<typeof initialState>;

// Reducer

export default (state: ImageDataState = initialState, action): ImageDataState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_IMAGEDATA_LIST):
    case REQUEST(ACTION_TYPES.FETCH_IMAGEDATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_IMAGEDATA):
    case REQUEST(ACTION_TYPES.UPDATE_IMAGEDATA):
    case REQUEST(ACTION_TYPES.DELETE_IMAGEDATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_IMAGEDATA_LIST):
    case FAILURE(ACTION_TYPES.FETCH_IMAGEDATA):
    case FAILURE(ACTION_TYPES.CREATE_IMAGEDATA):
    case FAILURE(ACTION_TYPES.UPDATE_IMAGEDATA):
    case FAILURE(ACTION_TYPES.DELETE_IMAGEDATA):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_IMAGEDATA_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_IMAGEDATA):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_IMAGEDATA):
    case SUCCESS(ACTION_TYPES.UPDATE_IMAGEDATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_IMAGEDATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.SET_BLOB:
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType
        }
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/image-data';

// Actions

export const getEntities: ICrudGetAllAction<IImageData> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_IMAGEDATA_LIST,
  payload: axios.get<IImageData>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IImageData> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_IMAGEDATA,
    payload: axios.get<IImageData>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IImageData> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_IMAGEDATA,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IImageData> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_IMAGEDATA,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IImageData> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_IMAGEDATA,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType
  }
});

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
