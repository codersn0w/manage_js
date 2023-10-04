function chatdata_to_message() {
    const parts = args[0].split('@');
	return parts[1];
}