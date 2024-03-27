const Login=()=>{
    return(
         <>
        <div className="Logdiv">
                <h1>Login</h1>
                <form>
                    <label htmlFor="">E-Mail:</label>
                    <input type="text" required />
                    <label htmlFor="">Password:</label>
                    <input type="password"  required />
                    <button id="Lbt">Login</button>
                </form>
            </div>
        </>
    )
}
export default Login;