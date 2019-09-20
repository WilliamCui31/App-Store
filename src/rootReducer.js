import { combineReducers } from 'redux';
import listReducer from './components/AppList/reducer';
import recomReducer from './components/Recommendation/reducer';
import searchReducer from './components/SearchBar/reducer';

const rootReducer = combineReducers({
  ...listReducer,
  ...recomReducer,
  ...searchReducer
});

export default rootReducer;
