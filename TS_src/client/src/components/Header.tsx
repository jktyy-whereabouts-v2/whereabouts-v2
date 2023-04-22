import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
	const imgstyle = { width: '10%', margin: '25px auto 25px auto', display: 'block' };
	return (
		<>
			<Link to="/">
				<img style={imgstyle} src="../src/assets/logo.png" />
			</Link>
		</>
	);
}

export default Header;
