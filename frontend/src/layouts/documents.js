import CustomButton from "../components/customButton";
import router from "../AppRoutes";
import CustomDocumentForm from "../forms/customDocumentForm";
import { useState } from "react";
import Icons from "../icons/icons";

function DocumentsList() {
    return (
    <div className="app-body">
            <div className="body-header" style={{justifyContent:"space-between"}}>
                <h1 className="header1">Документы</h1>
                <CustomButton destination="custom" className="primary" text="Создать свой отчет" 
                onClick={() => router.navigate("custom", {replace:false})}></CustomButton>
            </div>

            <div className="body5" style={{width:"100%", backgroundColor:"var(--grey2)", display:"flex", gap:"2px", flexDirection:"column"}}>
                <p style={{backgroundColor:"white", margin:"0", padding:"10px"}}>Отчет об индивидуальной работе со студентами</p>
                <p style={{backgroundColor:"white", margin:"0", padding:"10px"}}>Отчет о проведенных мероприятиях</p>
                <p style={{backgroundColor:"white", margin:"0", padding:"10px"}}>Состав академической группы</p>
            </div>
    </div>)
}

function CustomDocument() {
    const [pdfUrl, setPdfUrl] = useState(null);

    return (
        <div className="app-body" style={{flexDirection:"row"}}>
            <div style={{width:"auto", flexGrow:"1"}}>
                <div className="body-header" style={{gap:"10px"}}>
                    <CustomButton style={{padding:"5px"}} onClick={() => router.navigate(-1)} className="transparent"
                    icon={<Icons name="chevronLeft" size={24} color="var(--dark-blue)" className="big"/>}/>
                    <h1 className="header1">Свой отчет</h1>
                </div>
    
                <CustomDocumentForm setPdfUrl={setPdfUrl}/>
            </div>

            {pdfUrl ? (
                <embed src={pdfUrl + '#zoom=FitH'} type="application/pdf" style={{minWidth:"50vw", flexGrow:"2"}} />
            ) : (
                <></>
            )}
        </div>
    )
}

export {DocumentsList, CustomDocument}