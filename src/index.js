import './index.html';
import './index.less';
import './utils/polyfill';
import dva from 'dva';
// import 'vconsole';


// 1. Initialize
const app = dva();

// 2. Plugins
//app.use({});

// 3. Model
app.model(require('./models/user'));
app.model(require('./models/home'));
app.model(require('./models/card'));
app.model(require('./models/address'));
app.model(require('./models/product'));
app.model(require('./models/order'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
