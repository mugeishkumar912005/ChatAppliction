import { useState } from "react";
const Sign=()=>{
    const[Username,SetName]=useState();
    const[Phone_no,SetPh]=useState();
    const[Email,SetEmail]=useState();
    const[Password,SetPass]=useState();
    const[conP,SetP]=useState();
    const HandleSignup = async (e) => {
        e.preventDefault();
        try {
            if (Password !== conP) {
                alert("Passwords don't match");
            } else if (!Username || !Phone_no || !Email || !Password) {
                alert("Please fill in all fields");
            } else {
                await axios.post("http://localhost:5500/AddUser", {
                    Username,
                    Phone_no,
                    Email,
                    Password
                });
                console.log("Added successfully!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Oops! Can't Add");
        }
    }    
    return (
        <>
        <div className="SignUpContainer">
                <div className="SignUp">
                    <h2>Sign Up</h2>
                    <form>
                        <div className="Form">
                            <label>Username:</label>
                            <input
                                value={Username}
                                onChange={(e)=>{SetName(e.target.value)}}
                                type="text"
                                id="username"
                                name="username"
                                required/>
                            <label>Phone_no:</label>
                            <input
                                value={Phone_no}
                                onChange={(e)=>{SetPh(e.target.value)}}
                                type="number"
                                id="ph"
                                name="username"
                                required
                            />
                            <label>Email:</label>
                            <input
                                value={Email}
                                onChange={(e)=>SetEmail(e.target.value)}
                                type="email"
                                id="email"
                                name="email"
                                required
                            />
                            <label>Password:</label>
                            <input
                                value={Password}
                                onChange={(e)=>SetPass(e.target.value)}
                                type="password"
                                id="password"
                                name="password"
                                required
                            />
                            <label>Confirm Password:</label>
                            <input
                                value={conP}
                                onChange={(e)=>SetP(e.target.value)}
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                            />
                            <button id="submit" onClick={HandleSignup}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default Sign;