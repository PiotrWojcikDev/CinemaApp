const CreateError = (status, message) => {
    return {
        status: status,
        message: message
    };
};

module.exports = CreateError;
