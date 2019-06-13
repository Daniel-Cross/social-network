import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
	const [ formData, setFormData ] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const { name, email, password, confirmPassword } = formData;

	const handleInput = (e) => {
		setFormData({
			...formData, [e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if(password !== confirmPassword) {
			console.log('Passwords do not match')}
			else {
			console.log(formData)
			}

	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user" /> Create Your Account
			</p>
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-group">
					<input type="text" placeholder="Name" name="name" value={name} required onChange={handleInput} />
				</div>
				<div className="form-group">
					<input type="email" placeholder="Email Address" value={email} name="email" onChange={handleInput} required />
					<small className="form-text">
						This site uses Gravatar so if you want a profile image, use a Gravatar email
					</small>
				</div>
				<div className="form-group">
					<input type="password" placeholder="Password" name="password" value={password} onChange={handleInput} minLength="6" required />
				</div>
				<div className="form-group">
					<input type="password" placeholder="Confirm Password" name="confirmPassword" value={confirmPassword} minLength="6" onChange={handleInput} required />
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	);
};

export default Register;
