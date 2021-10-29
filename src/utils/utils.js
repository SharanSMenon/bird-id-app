export function getPosition() {
    return new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject)
    );
}

export const checkIfPositionSet = () => {
    if (localStorage.getItem("position") == null) {
        return false
    } else {
        return localStorage.getItem("position")
    }
}