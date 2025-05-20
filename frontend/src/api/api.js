import { baseUrl } from "../Consts"
import useGlobal from "../store"

const fetchTutor = (id) => {
  return fetch(`${baseUrl}tutor/${id}`)
      .then(response => {
      return response.json()
      })
}

const fetchMajor = (id) => {
  return fetch(`${baseUrl}major/${id}`)
      .then(response => {
      return response.json()
      })
}

const fetchEvents = (year, month) => {
    return fetch(`http://127.0.0.1:8000/events/${year}/${month}`)
        .then(response => {
        return response.json()
        })
  }

  const fetchHealth = (id) => {
    return fetch(`${baseUrl}student/${id}/health`)
      .then(response => {
      return response.json()
      })
  }
  
const postEvent = async (event) => {
    try {
        const response = await fetch(`${baseUrl}events/`, {
            method: "POST",
            headers: {'Content-Type': 'application/json; charset= utf-8'},
            body: JSON.stringify(event)
        }).then(response => {
            if(!response.ok) {
                throw response.json()
            }
            if (response.status !== 204) {
                return response.json()
            }
        }).catch(error => {
            throw error
        })
    } catch (error) {
        throw error
    }
}
  
  const putEvent = async (event) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/events/${event.id}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json; charset= utf-8'},
        body: JSON.stringify(event)
    }).then(response => {
        if(!response.ok) {
            throw response.json()
        }
        if (response.status !== 204) {
            return response.json()
        }
        }).catch(error => {
            throw error
        })
    } catch (error) {
        throw error
    }
}

const deleteEvent = async (id) => {
    try {
        return await fetch(`http://127.0.0.1:8000/events/${id}`, {
            method: "DELETE"
        }).then(response => {
            if(!response.ok) {
                throw response.json()
            }
            if (response.status !== 204) {
                return response.json()
            }
        }).catch(error => {
            throw error
        })
    } catch (error) {
        throw error
    }
}

const putStudent = async(student) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/student/${student.id}`, {
            method: "PUT",
            headers: {'Content-Type': 'application/json; charset= utf-8'},
            body: JSON.stringify(student)
        }).then(response => {
            if(!response.ok) {
                throw response.json()
            }
            if (response.status !== 204) {
                return response.json()
            }
        }).catch(error => {
            throw error
        })
    } catch (error) {
        throw error
    }
}

const putFamily = async (id, data) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/student/${id}/family`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json; charset= utf-8'},
        body: JSON.stringify(data)
    }).then(response => {
        if(!response.ok) {
            throw response.json()
        }
        if (response.status !== 204) {
            return response.json()
        }
    }).catch(error => {
            throw error
    })
    } catch (error) {
        throw error
    }
}

const putHealth = async (id, data) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/student/${id}/health`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json; charset= utf-8'},
        body: JSON.stringify(data)
    }).then(response => {
            if(!response.ok) {
                throw response.json()
            }
            if (response.status !== 204) {
                return response.json()
            }
        }).catch(error => {
                throw error
        })
    } catch (error) {
        throw error
    }
}

const putTutor = (tutor, id) => {
  return fetch(`http://127.0.0.1:8000/tutor/${id}`, {
    method: "PUT",
    headers: {'Content-Type': 'application/json; charset= utf-8'},
    body: JSON.stringify(tutor)
  })
      .then(response => {
      return response.json()
      })
}


const fetchStudents = (data=null) => {
    return fetch(`${baseUrl}students/${data? "?data=" + encodeURIComponent(JSON.stringify(data)) : ""}`, )
        .then(response => {
        return response.json()
        })
}

const createPdf = (data) => {
  return fetch(`${baseUrl}/generate-pdf/${encodeURIComponent(JSON.stringify(data))}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/pdf',
              },
            }).then(response => {
              return response.blob()
            })
}

const fetchGroups = async (user) => {
    try{
        await fetch(`${baseUrl}groups/${user}`)
            .then(response => {
            return response.json()
            })
    } catch (error) {
        throw error
    }
}

const fetchStudent = (id) => {
  return fetch(`${baseUrl}student/${id}`)
      .then(response => {
      return response.json()
      })
}

const fetchFamily = (id) => {
  return fetch(`${baseUrl}student/${id}/family`)
      .then(response => {
      return response.json()
      })
}

const fetchChoice = (model) => {
  return fetch(`${baseUrl}choices/${model}`)
      .then(response => {
      return response.json()
      })
}


const getEmptyInstance = (model) => {
  return fetch(`${baseUrl}empty/${model}`)
      .then(response => {
      return response.json()
      })
}

const updateStudentProfile = async(id, studentData, family, health) => {
        const data = {
            id: id,
            studentData: studentData,
            family: family,
            health: health
        }

        try {
            const response = await fetch(`${baseUrl}transaction/${encodeURIComponent(JSON.stringify(data))}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json; charset= utf-8',
                },
            }).then(response => {
                if(!response.ok) {
                    throw response.json()
                }
                if (response.status !== 204) {
                    return response.json()
                }
            }).catch(error => {
                    throw error
            })
        } catch (error) {
            throw error
        }
}


export {
    deleteEvent, 
    putEvent,
    putStudent,
    putTutor,
    putFamily,
    putHealth, 
    postEvent, 
    fetchEvents,
    fetchMajor,
    fetchTutor,
    fetchStudents,
    fetchGroups,
    fetchStudent,
    fetchFamily,
    fetchHealth,
    fetchChoice,
    getEmptyInstance,
    createPdf,
    updateStudentProfile
}