export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const validateUsername = (username: string): boolean => {
    const re = /^.{3,20}$/;
    return re.test(String(username).toLowerCase());
}

export const validateUsernameError = (username: string): string => {
    if (username.length < 3) {
        return 'Username must be at least 3 characters long';
    }
    if (username.length > 20) {
        return 'Username must be at most 20 characters long';
    }
    return '';
}

export const validatePassword = (password: string): boolean => {
    // Has to have at least one number, one uppercase, one lowercase, and at least 8 characters.
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

export const validatePasswordError = (password: string): string => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!password.match(/[a-z]/)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!password.match(/[A-Z]/)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!password.match(/\d/)) {
        return 'Password must contain at least one number';
    }
    return '';
}

export const validateNameError = (name: string) => {
    name = name.trim();
    if (!name) return "";
    if (name.length < 2) return "Name must be at least 2 characters long";
    if (name.length > 32) return "Name must be at most 32 characters long";
    return "";
}