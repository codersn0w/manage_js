function chatdata_to_emotion() {
    const inputString = args[0];
    const parts = inputString.split("@");
	return parts[2];
}

chatdata_to_emotion()