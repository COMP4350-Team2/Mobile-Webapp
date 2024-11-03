import "./Loading.css"; // Create this CSS file separately

const Loading = () => {
	return (
		<div className="loading-container secondary-color">
			{/* Background Logo */}
			<div className="logo-background" />
			<div className="spinner"></div>
			<p>Loading...</p>
		</div>
	);
};

export default Loading;
