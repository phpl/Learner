import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITextData, defaultValue } from 'app/shared/model/text-data.model';

export const ACTION_TYPES = {
  FETCH_TEXTDATA_LIST: 'textData/FETCH_TEXTDATA_LIST',
  FETCH_TEXTDATA: 'textData/FETCH_TEXTDATA',
  CREATE_TEXTDATA: 'textData/CREATE_TEXTDATA',
  UPDATE_TEXTDATA: 'textData/UPDATE_TEXTDATA',
  DELETE_TEXTDATA: 'textData/DELETE_TEXTDATA',
  RESET: 'textData/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITextData>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type TextDataState = Readonly<typeof initialState>;

// Reducer

export default (state: TextDataState = initialState, action): TextDataState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TEXTDATA_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TEXTDATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TEXTDATA):
    case REQUEST(ACTION_TYPES.UPDATE_TEXTDATA):
    case REQUEST(ACTION_TYPES.DELETE_TEXTDATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TEXTDATA_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TEXTDATA):
    case FAILURE(ACTION_TYPES.CREATE_TEXTDATA):
    case FAILURE(ACTION_TYPES.UPDATE_TEXTDATA):
    case FAILURE(ACTION_TYPES.DELETE_TEXTDATA):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TEXTDATA_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TEXTDATA):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TEXTDATA):
    case SUCCESS(ACTION_TYPES.UPDATE_TEXTDATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TEXTDATA):
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

const apiUrl = 'api/text-data';

// Actions

export const getEntities: ICrudGetAllAction<ITextData> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_TEXTDATA_LIST,
  payload: axios.get<ITextData>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ITextData> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TEXTDATA,
    payload: axios.get<ITextData>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITextData> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TEXTDATA,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITextData> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TEXTDATA,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITextData> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TEXTDATA,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
