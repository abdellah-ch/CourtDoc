
export const fetchMessageTypes = async (setMessageTypes: (data: any[]) => void) => {
    try {
        const res = await fetch("/api/MessageTypes");
        const data: any[] = await res.json();
        setMessageTypes(data);
        console.log(data);
    } catch (error) {
        console.error("Error fetching message types:", error);
    }
};


//fetchFiliere Libelle
export const fetchFiliereLibelle = async (IdFiliere: number, setFiliereLibelle: (data: string) => void) => {
    const res = await fetch("/api/getFiliereLibelle", {
        method: "POST",
        body: JSON.stringify({
            IdFiliere
        })
    })

    const data = await res.json();

    setFiliereLibelle(data.Libelle)
}


//fetchSource type sources and sources relation

export const fetchSources = async (setAllSources: (data: any) => void) => {
    const res = await fetch("/api/SourceType")
    const data = await res.json()

    setAllSources(data)

    console.log(data);
}

export const fetchResponsables = async (setResponsables: (data: any) => void) => {

    const res = await fetch("/api/getResponsableList")
    const data = await res.json()

    setResponsables(data)

    console.log(data);
}


export const fetchCodeFilieres = async (IdFiliere: number, setCodeFilieres: (data: any[]) => void) => {
    const res = await fetch("/api/codeFiliere", {
        method: "POST",
        body: JSON.stringify({
            IdFiliere
        })
    })

    const data = await res.json()

    console.log(data);

    setCodeFilieres(data)
}

//add the messagerie 
export async function createMessagerie(messagerieData:any) {
  try {
    const response = await fetch('/api/addMessagerie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numeroMessage: messagerieData.numeroMessage,
        dateMessage: messagerieData.dateMessage,
        dateArrivee: messagerieData.dateArrivee,
        sujet: messagerieData.sujet,
        remarques: messagerieData.remarques,
        statut: messagerieData.statut,
        idType: messagerieData.idType,
        IdTypeSource: messagerieData.IdTypeSource,
        idProsecutor: messagerieData.idProsecutor,
        idCode: messagerieData.idCode,
        idSource: messagerieData.idSource,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create messagerie');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating messagerie:', error);
    throw error;
  }
}

export async function fetchMessageriesByFiliere(idFiliere: number,setMessageries: (data: any[]) => void) {
  const response = await fetch(`/api/messageries/by-filiere?idFiliere=${idFiliere}`,{
    method:"GET"
  });
  console.log(response);
   
  if (!response.ok) {
    throw new Error(`Failed to fetch messageries: ${response}`);
  }
  
  const data = await response.json();
  console.log(data);
   
  setMessageries(data)
}
