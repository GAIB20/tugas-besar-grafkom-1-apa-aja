import { Button } from "@/components/ui/button"

import './App.css'

function App() {

  return (
    <>
      <div className='w-full h-full relative flex flex-col overflow-hidden' id='root'>
        <div className='h-[40px] flex justify-center items-center bg-black text-white' id='header'>
          <h1>2D Primitive Elements</h1>
        </div>
        <div className='h-screen flex flex-row' id='root-panel'>

          <div className='flex flex-col w-[30%] justify-center items-center gap-8 bg-amber-200' id='left-panel'>

            <h2 className="font-bold text-[28px]">Shapes:</h2>
            <Button>Line</Button>
            <Button>Square</Button>
            <Button>Rectangle</Button>
            <Button>Polygon</Button>

            <h2 className="font-bold text-[28px]">Tools:</h2>
            <Button>Clear Canvas</Button>
            <Button>Save</Button>
            <Button>Load</Button>
          </div>

          <canvas id='canvas'></canvas>

          <div className='flex flex-col w-[30%]  bg-amber-200 pt-[20px] px-[20px]' id='right-panel'>
            <h2>List of Objects:</h2>
            <select className="h-[35px] bg-white mt-[10px]"></select>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
