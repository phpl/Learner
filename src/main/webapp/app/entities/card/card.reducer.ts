import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICard, defaultValue } from 'app/shared/model/card.model';

export const ACTION_TYPES = {
  FETCH_CARD_LIST: 'card/FETCH_CARD_LIST',
  FETCH_CARD: 'card/FETCH_CARD',
  CREATE_CARD: 'card/CREATE_CARD',
  UPDATE_CARD: 'card/UPDATE_CARD',
  DELETE_CARD: 'card/DELETE_CARD',
  SET_BLOB: 'card/SET_BLOB',
  RESET: 'card/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICard>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CardState = Readonly<typeof initialState>;

// Reducer

export default (state: CardState = initialState, action): CardState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CARD_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CARD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CARD):
    case REQUEST(ACTION_TYPES.UPDATE_CARD):
    case REQUEST(ACTION_TYPES.DELETE_CARD):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CARD_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CARD):
    case FAILURE(ACTION_TYPES.CREATE_CARD):
    case FAILURE(ACTION_TYPES.UPDATE_CARD):
    case FAILURE(ACTION_TYPES.DELETE_CARD):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CARD_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CARD):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CARD):
    case SUCCESS(ACTION_TYPES.UPDATE_CARD):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CARD):
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

const apiUrl = 'api/cards';

// Actions

export const getEntities: ICrudGetAllAction<ICard> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CARD_LIST,
  payload: axios.get<ICard>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICard> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CARD,
    payload: axios.get<ICard>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICard> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CARD,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICard> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CARD,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntityRevise: ICrudPutAction<ICard> = entity => async dispatch => {
  return dispatch({
    type: ACTION_TYPES.UPDATE_CARD,
    payload: axios.put(`${apiUrl}/review`, cleanEntity(entity))
  });
};

export const deleteEntity: ICrudDeleteAction<ICard> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CARD,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const getEntitiesForCategory: ICrudGetAllAction<ICard> = id => ({
  type: ACTION_TYPES.FETCH_CARD_LIST,
  payload: axios.get<ICard>(`${apiUrl}?categoryId=${id}&cacheBuster=${new Date().getTime()}`)
});

export const getEntitiesForLoggedUser: ICrudGetAllAction<ICard> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CARD_LIST,
  payload: axios.get<ICard>(`${apiUrl}?logged=1&cacheBuster=${new Date().getTime()}`)
});

export const createEntityForLoggedUser: ICrudPutAction<ICard> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CARD,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntitiesForLoggedUser());
  return result;
};

export const updateEntityForLoggedUser: ICrudPutAction<ICard> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CARD,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntitiesForLoggedUser());
  return result;
};

export const deleteEntityForLoggedUser: ICrudDeleteAction<ICard> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CARD,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntitiesForLoggedUser());
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
