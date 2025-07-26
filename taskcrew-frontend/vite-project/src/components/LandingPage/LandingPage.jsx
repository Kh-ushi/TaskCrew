
import "./LandingPage.css";
import NavBar from "./NavBar";

function LandingPage() {
    return (
        <div className="landing-page">
            <NavBar></NavBar>
            <div className="landing-page-header">
                <div><h1>Your Universe of Seamless</h1></div>
                <div><h1>Project Mangement</h1></div>
                <div className="landing-page-header-bottom">
                    <p>Seamlessly Organize tasks, collaborate with teams and bring your ideas to life all in one</p>
                    <p>place.Planit,make productivity effortless,so you can focus on what truly matters.</p>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;