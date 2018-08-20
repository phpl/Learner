import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICardInfo, defaultValue } from 'app/shared/model/card-info.model';

export const ACTION_TYPES = {
  FETCH_CARDINFO_LIST: 'cardInfo/FETCH_CARDINFO_LIST',
  FETCH_CARDINFO: 'cardInfo/FETCH_CARDINFO',
  CREATE_CARDINFO: 'cardInfo/CREATE_CARDINFO',
  UPDATE_CARDINFO: 'cardInfo/UPDATE_CARDINFO',
  DELETE_CARDINFO: 'cardInfo/DELETE_CARDINFO',
  RESET: 'cardInfo/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICardInfo>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CardInfoState = Readonly<typeof initialState>;

// Reducer

export default (state: CardInfoState = initialState, action): CardInfoState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CARDINFO_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CARDINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CARDINFO):
    case REQUEST(ACTION_TYPES.UPDATE_CARDINFO):
    case REQUEST(ACTION_TYPES.DELETE_CARDINFO):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CARDINFO_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CARDINFO):
    case FAILURE(ACTION_TYPES.CREATE_CARDINFO):
    case FAILURE(ACTION_TYPES.UPDATE_CARDINFO):
    case FAILURE(ACTION_TYPES.DELETE_CARDINFO):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CARDINFO_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CARDINFO):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CARDINFO):
    case SUCCESS(ACTION_TYPES.UPDATE_CARDINFO):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CARDINFO):
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

const apiUrl = 'api/card-infos';

// Actions

export const getEntities: ICrudGetAllAction<ICardInfo> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CARDINFO_LIST,
  payload: axios.get<ICardInfo>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICardInfo> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CARDINFO,
    payload: axios.get<ICardInfo>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICardInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CARDINFO,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICardInfo> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CARDINFO,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICardInfo> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CARDINFO,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
