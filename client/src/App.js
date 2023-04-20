"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Header_1 = require("./components/Header");
var StartPage_1 = require("./components/pages/StartPage");
var Login_1 = require("./components/pages/Login");
var Registration_1 = require("./components/pages/Registration");
var Dashboard_1 = require("./components/pages/Dashboard");
var ChatPage_1 = require("./components/ChatPage");
function App() {
    var _a = (0, react_1.useState)({
        name: '',
        phone_number: '',
        password: '',
    }), userInfo = _a[0], setUserInfo = _a[1];
    return (<>
			<react_router_dom_1.BrowserRouter>
				<Header_1.default />
				<react_router_dom_1.Routes>
					<react_router_dom_1.Route path="/" element={<StartPage_1.default userInfo={userInfo} setUserInfo={setUserInfo}/>}/>
					<react_router_dom_1.Route path="/login" element={<Login_1.default userInfo={userInfo} setUserInfo={setUserInfo}/>}/>
					<react_router_dom_1.Route path="/register" element={<Registration_1.default userInfo={userInfo} setUserInfo={setUserInfo}/>}/>
					<react_router_dom_1.Route path="/dashboard" element={<Dashboard_1.default userInfo={userInfo} setUserInfo={setUserInfo}/>}/>
					<react_router_dom_1.Route path="/chat" element={<ChatPage_1.default userInfo={userInfo}/>}/>
				</react_router_dom_1.Routes>
			</react_router_dom_1.BrowserRouter>
		</>);
}
exports.default = App;
