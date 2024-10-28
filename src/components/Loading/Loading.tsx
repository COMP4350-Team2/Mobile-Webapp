import React from "react";
import "./Loading.css"; // Create this CSS file separately

const Loading = () => {
	return (
		<div className="loading-container secondary-color">
			<div className="spinner"></div>
			<p>Loading...</p>
		</div>
	);
};

export default Loading;
