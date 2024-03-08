import styles from '../styles/Profil.module.css';
import HeaderConnected from './HeaderConnected'
import React, { useState, useEffect } from 'react';
import '../styles/CarrouselAvatar.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfil } from '../reducers/user';

function Profil(props) {
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();    const [selectedAvatar, setSelectedAvatar] = useState('');

    const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    }

    const [selectedImage, setSelectedImage] = useState(null);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [age, setAge] = useState('');
    const [prosituation, setProsituation] = useState('');
    const [financialCapacity, setFinancialCapacity] = useState('');
    const [desciption, setDesciption] = useState('');
    
    // Hooks d'états pour les inputs:
    const [delay, setDelay] = useState(0);
    const [budget, setBudget] = useState(10000);
    const [financed, setFinanced] = useState('yes');

    // Changer d'Avatar
    const handleImageChange = (event) => {
        setSelectedImage(event.target.value);
    };

    useEffect(() => {
        fetch('http://localhost:3000/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${user.token}` // Incluez le token dans l'en-tête Authorization
          },
        })
          .then(response => response.json())
          .then(data => {
        //console.log(data)
        data.result && dispatch(UpdateProfil({
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            age: data.user.age,
            prosituation: data.user.prosituation,
            financialCapacity: data.user.financialCapacity,
            desciption: data.user.desciption,
        })
        );
        setFirstname(data.user.firstname);
        setLastname(data.user.lastname);
        setAge(data.user.age);
        setProsituation(data.user.prosituation);
        setFinancialCapacity(data.user.financialCapacity);
        setDesciption(data.user.desciption);
          });
      }, []);

const handleSubmit = () => {
    fetch('http://localhost:3000/users/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${user.token}` // Incluez le token dans l'en-tête Authorization
          },
          body: JSON.stringify({ 
            firstname,
            lastname,
            age,
            prosituation,
            financialCapacity,
            desciption,
        }),
    }).then(response => response.json()).then(data => {
        console.log(data)
       // data.result && dispatch(UpdateProfil(
    
    })
}
    //Budget
    const minBudget = 0;
    const maxBudget = 1000000
  
    const handleBudgetChange = (e) => {
      let newBudget = parseInt(e.target.value);
      newBudget = Math.round(newBudget / 10000) * 10000;
      newBudget = Math.min(Math.max(minBudget, newBudget), maxBudget);
      setBudget(newBudget);
    };
  
    //Délai
    const minDelay = 0;
    const maxDelay = 52; 
  
    const handleDelayChange = (e) => {
    let newDelay = parseInt(e.target.value);
    newDelay = Math.min(Math.max(minDelay, newDelay), maxDelay);
    setDelay(newDelay);
  };

    return (
<div className={styles.main}>
    <div className={styles.header}>
        <HeaderConnected/>
    </div>
    <div className={styles.container}>
        <div className={styles.leftContainer}>
            <div className={styles.profilPic}>
            {selectedImage && <img src={selectedImage} alt="Profil" className={styles.selectedImage} />}                        
            <select className={styles.avatarbutton} onChange={handleImageChange}>
                <option value="">Choisis ton avatar</option>
                <option value="./avatar1.jpg">Avatar 1</option>
                <option  value="./avatar2.jpg">Avatar 2</option>
                <option  value="./avatar3.jpg">Avatar 3</option>
                <option value="./avatar4.jpg">Avatar 4</option>
                <option  value="./avatar5.jpg">Avatar 5</option>
                <option value="./avatar6.jpg">Avatar 6</option>
                <input type="hidden" classname={styles.input} />
            </select>
            </div>
        </div>
        <div className={styles.rightContainer}>
           <h3 className={styles.h3}> Mes informations:</h3>
           <div className={styles.inputConfiguration}>
                <p className={styles.p}>Username :</p>
                <input className={styles.input}/>
                </div>
                <div className={styles.inputConfiguration}>
                <p className={styles.p}>Délai maximum:</p>
                <input type="range" min={minDelay} max={maxDelay} value={delay} onChange={handleDelayChange} className={styles.inputRange}/>
                <span>{delay} semaine(s)</span>
                </div>
              <div className={styles.inputConfiguration}>
                <p className={styles.p}> Budget maximum: </p>
                <input type="range" min={minBudget} max={maxBudget} step={10000} value={budget} onChange={handleBudgetChange} className={styles.inputRange} />
                <span>{budget} €</span>
              </div>
              <div>

                <p className={styles.p}>Financement :</p>
                        <div >
                        <input type="radio" id="financed-yes" name="financed" value="yes" checked={financed === "yes"} onChange={() => setFinanced("yes")} />
                        <label htmlFor="financed-yes">Oui</label>
                        <input type="radio" id="financed-no" name="financed" value="no" checked={financed === "no"} onChange={() => setFinanced("no")} />
                        <label htmlFor="financed-no">Non</label>
                        </div>
                <div className={styles.inputConfiguration}>
                <p className={styles.p}>Quelques mots pour te décrire...</p>
                <input className={styles.inputDesc}/>
                </div>
            </div>
        </div>
    </div> 
    <button className={styles.button}>Mettre à jour mon profil ✓</button>
</div>
)
}


export default Profil