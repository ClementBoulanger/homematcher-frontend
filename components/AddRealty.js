import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/AddRealty.module.css'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import HeaderConnected from './HeaderConnected';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion, faCheck } from '@fortawesome/free-solid-svg-icons';
import ImageCarrousel from './Carrousel';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
const uniqid = require('uniqid')

function AddRealty() {
  const router = useRouter();
  const token = useSelector((state) => state.user.value.token);

  // Hooks d'états pour les inputs:
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState();
  const [livingArea, setLivingArea] = useState();
  const [outdoorArea, setOutdoorArea] = useState();
  const [rooms, setRooms] = useState();
  const [location, setLocation] = useState()
  const [terrace, setTerrace] = useState(false);
  const [typeOfRealty, setTypeOfRealty] = useState('Maison')
  const [delay, setDelay] = useState(0);
  const [budget, setBudget] = useState(10000);
  const [financed, setFinanced] = useState(false);
  const [imageUrl, setImageUrl] = useState([])
  const [showDocs, setShowDocs] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [realtyId, setRealtyId] = useState()
  const docs = ['Le dossier de diagnostics techniques.', 'La superficie loi Carrez de la maison', 'Un justificatif d’identité, d’adresse et de situation familiale', 'Les règlements de copropriété', 'Les 3 derniers procès-verbaux des assemblées générales de copropriétaires', 'Le carnet d’entretien de la maison', 'Le dernier appel de charges', 'Les données financières et techniques de la maison '];

  const minBudget = 0;
  const maxBudget = 1000000

  const handleBudgetChange = (e) => {
    let newBudget = parseInt(e.target.value);
    newBudget = Math.round(newBudget / 10000) * 10000;
    newBudget = Math.min(Math.max(minBudget, newBudget), maxBudget);
    setBudget(newBudget);
    setRealtyId(uniqid())
  };

  const minDelay = 0;
  const maxDelay = 52;

  const handleDelayChange = (e) => {
    let newDelay = parseInt(e.target.value);
    newDelay = Math.min(Math.max(minDelay, newDelay), maxDelay);
    setDelay(newDelay);
  };


  const handleInfoClick = () => {
    setShowDocs(!showDocs);
  };


  const handleButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  //Documents de droite
  const handleFileSelect = (e) => {
    const files = e.target.files;
    // Traitez les fichiers sélectionnés comme vous le souhaitez;
  }



const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  const formData = new FormData()
  formData.append('photoFromFront', file)
 fetch('http://localhost:3000/realtys/upload', {
  method: "POST",
  body: formData
 }).then(response => response.json())
   .then(data => setImageUrl([...imageUrl, data.url]))
}




const handleAddRealty = () => {
  fetch('http://localhost:3000/realtys/addRealtys', {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    },
    body: JSON.stringify({ description, price, livingArea, outdoorArea, rooms, location, terrace, typeOfRealty, delay, budget, financed, imageUrl, realtyId})
  }).then(response => response.json())  .then(data => {
    console.log(data)
    router.push('/RealtysPage')
  }).catch(error => console.error('Erreur:', error));
}

const handleTerraceChange = (e) => {
  setTerrace(e.target.value === "true");
};

  return (
    <div>
      <div className={styles.header}>
        <HeaderConnected />
      </div>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <div className={styles.inputContainer}>
          <h2 className={styles.h2}> Informations:</h2>
          <h4 className={styles.inputTitle}>Localisation : </h4>

            <LoadScript googleMapsApiKey="AIzaSyCT2rUBJUBCi8pssdiVhICE4ZriXamrsjw" libraries={["places"]} >  
            <Autocomplete onLoad={(autocomplete) => {
              autocomplete.setFields(['address_component']);
              autocomplete.setTypes(['(regions)']); 
              }}
            onPlaceChanged={() => {}}
            >
            <input className={styles.inputText} type="text" placeholder="Selectionnez la ville, le département, la région ou le pays" onChange={(e) => set} />
            </Autocomplete>
            </LoadScript>
            <h4 className={styles.inputTitle}> Description : </h4>
            <input type="text" className={styles.inputDesc} placeholder='Ecrivez une brève description du bien' onChange={(e) => setDescription(e.target.value)} value={description}/>
            <h4 className={styles.inputTitle}> Prix de vente souhaité : </h4>
            <input type="text" className={styles.inputText} placeholder='Inquiquez ici le prix en €'  onChange={(e) =>  setPrice(e.target.value)} value={price}/>
            <h4 className={styles.inputTitle}> Intérieur : </h4>
            <input type="text" className={styles.inputText} placeholder='Surface habitable : ...m²'  onChange={(e) => setLivingArea(e.target.value)} value={livingArea} />
            <input type="text" className={styles.inputText} placeholder='Nombre de pièces: ...' onChange={(e) => setRooms(e.target.value)} value={rooms}/>
          
            <h4 className={styles.inputTitle}> Extérieur : </h4>
            <input type="text" className={styles.inputText} placeholder='Surface du terrain : ...m²'  onChange={(e) => setOutdoorArea(e.target.value)} value={outdoorArea} />
            <div className={styles.radioContainer}>
            <input type="radio" id="terrace-yes" name="terrace" value="true" checked={terrace} onChange={handleTerraceChange}/>
              <label htmlFor="terrace-yes">Avec terrasse</label>
            <input type="radio" id="terrace-no" name="terrace" value="false" checked={!terrace} onChange={handleTerraceChange}/>
              <label htmlFor="terrace-no">Sans terrasse</label>
            <br/>
            <h4 className={styles.inputTitle}>Type de bien : </h4>
            <input type="radio" id="typeofRealty-Maison" name="typeOfRealty" value="Maison" checked={typeOfRealty === "Maison"} onChange={() => setTypeOfRealty("Maison")} />
              <label htmlFor="typeofRealty-Maison">Maison</label>
            <input type="radio" id="typeOfRealty-Appartement" name="typeOfRealty" value="Appartement" checked={typeOfRealty === "Appartement"} onChange={() => setTypeOfRealty("Appartement")} />
              <label htmlFor="typeOfRealty-Appartement">Appartement</label>
                    </div>
              </div>
         </div>
          <div className={styles.middleContainer}>
          {/* <input
           type="file"
           accept="image/*" // Accepte uniquement les fichiers images
           multiple // Permet à l'utilisateur de sélectionner plusieurs fichiers
           onChange={handlePhotoChange}
           className={styles.inputFile}
          /> */}
           <input type="file" id="fileInput" multiple onChange={handlePhotoChange} style={{ display: 'none' }} />
                 <button className={styles.button} onClick={handleButtonClick}>Ajouter une image</button>
          <ImageCarrousel images={imageUrl} className={styles.carrousel}/>
          {/* Bouton pour ajouter le bien */}
          <Link href='/RealtysPage'>
          <button className={styles.button} onClick={handleAddRealty}> Ajouter un bien </button>
          </Link>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.mandatoryDocuments}>
              <h2 className={styles.h2}>Documents Obligatoires</h2>
              <FontAwesomeIcon onClick={handleInfoClick} className={styles.infoButton} icon={faQuestion} />
              {showDocs &&
                <div>
                  <ul>
                    {docs.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>
              }
              <div className={styles.downloadDocuments}>
                <input type="file" id="fileInput" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
                <button className={styles.button} onClick={handleButtonClick}>Documents à fournir</button>
                {filesSelected && <FontAwesomeIcon className={styles.downloadIcon} icon={faCheck} color="green" />}
              </div>
          </div>
          <div className={styles.whiteContainer}>
            <div className={styles.infoAcheteur}>
           <h3 className={styles.h3}> Profil acheteur souhaité:</h3>
              <div className={styles.inputRangeContainer}>
                <p className={styles.p}>Délai :</p>
                <input type="range" min={minDelay} max={maxDelay} value={delay} onChange={handleDelayChange} className={styles.inputRange}/>
                <span>{delay} semaine(s)</span>
              </div>
              <div className={styles.inputRangeContainer}>
                <p className={styles.p}> Budget : </p>
                <input type="range" min={minBudget} max={maxBudget} step={10000} value={budget} onChange={handleBudgetChange} className={styles.inputRange} />
                <span>{budget} €</span>
              </div>
              <div classname={styles.inputRangeContainer}>
                <p classename={styles.p}>Financement :</p>
                <div classname={styles.radioContainer}>
                  <input type="radio" id="financed-yes" name="financed" value={true} checked={financed === true} onChange={() => setFinanced(true)} />
                  <label htmlFor="financed-yes">Oui</label>
                  <input type="radio" id="financed-no" name="financed" value={false} checked={financed === false} onChange={() => setFinanced(false)} />
                  <label htmlFor="financed-no">Non</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default AddRealty;

