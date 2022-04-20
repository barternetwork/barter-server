import developmentConfig from './config.comm';
import currentConfig from './config';

let productionConfig = Object.assign(developmentConfig,currentConfig);

const configs = {
  development: developmentConfig,
  production: productionConfig,
};
const env = process.env.NODE_ENV || 'development';

export default () => configs[env];
