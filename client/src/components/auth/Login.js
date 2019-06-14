import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
	const [ formData, setFormData ] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const handleInput = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleLogin = (e) => {
		e.preventDefault();
	};

	return (
		<Fragment>
			<div className="alert alert-danger">Invalid credentials</div>
			<h1 className="large text-primary">Sign In</h1>
			<p className="lead">
				<i className="fas fa-user" /> Sign into Your Account
			</p>
			<form className="form" onSubmit={handleLogin}>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						required
						value={email}
						onChange={handleInput}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={handleInput}
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>
			<p className="my-1">
				Don't have an account? <Link to="/register">Sign Up</Link>
			</p>
		</Fragment>
	);
};

export default Login;
