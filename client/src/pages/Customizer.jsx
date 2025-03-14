import React,{useState,useEffect} from 'react'
import {AnimatePresence,motion} from 'framer-motion'
import { useSnapshot } from 'valtio'
import config from '../config/config'
import state from '../store'
import {download} from '../assets'
import {downloadCanvasToImage,reader} from '../config/helpers'
import {EditorTabs,FilterTabs,DecalTypes} from '../config/constants'
import { fadeAnimation,slideAnimation } from '../config/motion'
import { AIPicker,FilePicker,ColorPicker,CustomButton,Tab } from '../components'

const Customizer = () => {
    const snap=useSnapshot(state);
    const [file, setFile] = useState('');//to upload file
    const [prompt, setPrompt] = useState('');//ai prompt
    const [generatingImg, setGeneratingImg] = useState(false);
  
    const [activeEditorTab, setActiveEditorTab] = useState("");//show which tab is currently being used
    const [activeFilterTab, setActiveFilterTab] = useState({
      logoShirt: true,//will show logo
      stylishShirt: false,
    })
    //show tab content when clicked
    const generateTabContent=()=>{
      switch (activeEditorTab) {
        case "colorpicker":
          return <ColorPicker />
        case "filepicker":
          return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
          />
        case "aipicker":
          return <AIPicker/>
        default:
          return null;
      }
    }

    const handleDecals=(type,result)=>{
        const decalType=DecalTypes[type];

        state[decalType.stateProperty]=result;

        if(!activeFilterTab[decalType.filterTab]){
            handleActiveFiltertab(decalType.filterTab)
        }
    }

    const handleActiveFiltertab=(tabName)=>{
        switch(tabName){
            case "logoShirt":
                state.isLogoTexture=!activeFilterTab[tabName];
                break;
            case "stylishShirt":
                state.isFullTexture=!activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture=true;
                state.isFullTexture=false;
                 break;  
        }

        //after setting the state, activeFilterTab is Updated
        setActiveFilterTab((prevState)=>{
            return{
                ...prevState,
                [tabName]:!prevState[tabName]
            }
        })
    }

    const readFile=(type)=>{
        reader(file).then((result)=>{
            handleDecals(type,result);
            setActiveEditorTab("");
        })
    }

  
  return (
    <AnimatePresence>
        {!snap.intro && (
        <>
        <motion.div key="custom"
        className="absolute top-0 left-0 z-10"
        {...slideAnimation('left')}>
            <div className='flex items-center min-h-screen'>
                <div className='editortabs-container tabs'>
                   {EditorTabs.map((tab)=>(
                    <Tab key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}/>
                   ))} 
                   {generateTabContent()}
                </div>
            </div>
        </motion.div>
        <motion.div
        className='absolute z-10 top-5 right-5'
        {...fadeAnimation}
        >
            <CustomButton
            type="filled"
            title="Go Back"
            handleClick={()=> state.intro=true}
            customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
        </motion.div>
        <motion.div className='filtertabs-container'
        {...slideAnimation('up')}
        >
            {FilterTabs.map((tab)=>(
                    <Tab key={tab.name}
                    tab={tab} 
                    isFilterTab
                    isActiveTab={activeFilterTab[tab.name]}
                    handleClick={()=>handleActiveFiltertab(tab.name)}
                    />
                   ))} 
        </motion.div>
        </>
        )}
    </AnimatePresence>
  )
}

export default Customizer