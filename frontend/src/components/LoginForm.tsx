import {useState, FormEvent, ChangeEvent} from "react";

function LoginForm() {

    const [username, setUsername] = useState<string>("user");
    const [password, setPassword] = useState<string>("password");
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [admin, setAdmin] = useState<string>("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetch("http://localhost:8080/token", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })
            .then(response => {
                return response.ok ? response.text() : Promise.reject(response);
            })
            .then(new_token => {
                setToken(new_token);
                downloadDataFromSecuredEndpoint(new_token);
                downloadDataFromAdminEndpoint(new_token);
            })
            .catch((error: Error) => {
                console.log(error);
                if (error.message.includes("Failed to fetch")) {
                    setError("Błąd połączenia z serwerem. Sprawdź, czy serwer jest uruchomiony.");
                } else {
                    setError(`Błąd logowania: ${error.message}`);
                }
                console.error("Error:", error);
            });
    };

    const downloadDataFromSecuredEndpoint = (new_token: string) => {
        fetch("http://localhost:8080", {
            method: "GET",
            headers: {"Authorization": `Bearer ${new_token}`}
        })
            .then(response => response.text())
            .then(message => setMessage(message))
            .catch((error: Error) => { setMessage("Error: " + error.message); });
    }

    const downloadDataFromAdminEndpoint = (new_token: string) => {
        fetch("http://localhost:8080/secure", {
            method: "GET",
            headers: {"Authorization": `Bearer ${new_token}`}
        })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    return Promise.reject(response);
                }
                return response.text();
            })
            .then(message => setAdmin(message))
            .catch((error: Response) => {
                console.log(error);
                setAdmin("Error: " + error.status);
            });
    }

    return (
        <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Username</label>
            <input type="text" value={username}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
            </div>
            <div>
            <label>Password</label>
            <input type="text" value={password}
                   onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
            {error && <p>{error}</p>}
            {token &&
                <>
                    <p>Token: {token}</p>
                    <p>{message}</p>
                    <p>{admin}</p>
                </>
            }

        </form>
        </div>
    );
}

export default LoginForm;