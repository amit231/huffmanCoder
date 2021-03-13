import React, { useState, useRef, useEffect, useContext } from 'react'
import styled from 'styled-components'
import huff from '../utils/huffman'
import { NotificationContext } from '../utils/notification'
import { v4 } from 'uuid'
import ErrorBoundary from '../utils/ErrorBoundary'
const coder = new huff();
const Background = styled.div`
    box-sizing: border-box;
    padding-top:30px;
    height:100vh;
    width:100vw;
    background-color:#2F2FA2;
    text-align:center;
    overflow-y:scroll;
    overflow-x:hidden;
    @media (max-width:450px){
        padding-top:5px;
    }
`
const Heading = styled.h1`
    height:4%;
    color:white;
`


const ButtonWrapper = styled.div`
    width:100%;
    height:5%;
    display: flex;
    justify-content: space-evenly;
    margin-bottom:30px;
    @media (max-width:450px){
        margin-bottom:20px;
    }
`

const Button = styled.button`
    position: relative;
    background-color:inherit;
    width:20%;
    height:50px;
    border:none;
    outline:none;
    font-size:1.7rem;
    color:#F64C72;
    border-radius:20px;
    border:3px solid #F64C72;
    z-index:0;
    @media (max-width:450px){
        font-size:1rem;
        width:auto;
    }

    /* ::after{
        content:'';
        position:absolute;
        top:30%;
        width:100%;
        height:100%;
        background-color:black;
    } */
    
`

const DragArea = styled.div`
    position: relative;
    width:100%;
    height:calc(89% - 60px);
    border-top:3px solid grey;
    input{
        color:#F64C72;
        width:100%;
        height:100%;
        
    }
    span{
        font-size:2rem;
        color:#F64C72;
        display:block;

        text-align:center;
        opacity:0.7;
    }

`
const TreeDisplay = styled.div`
    padding:10px;
    color:white;
    font-size:1.3rem;
    width:100%;
    /* height:100%; */
    /* overflow:scroll; */
    box-sizing:border-box;
    border-bottom:3px solid grey;
`

function Zipper() {
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    let [tree, setTree] = useState('');
    const [xy, setXy] = useState({ x: 0, y: 0 })
    let ipRef = useRef();
    let opRef = useRef();
    let nofificationDispatch = useContext(NotificationContext)

    function drawCircles(e) {
        setXy(xy => ({ x: e.clientX, y: e.clientY }))
    }
    useEffect(() => {
        console.log(xy.x, xy.y)
    }, [xy])
    function downloadFile(fileName, data) {
        let a = document.createElement('a');
        a.href = "data:application/octet-stream," + encodeURIComponent(data);
        a.download = fileName;
        a.click();
    }
    let internal =
        <>
            <span>DRAG FILE HERE</span>
            <input type='file' onChange={handleFileSubmit} />
        </>
    if (isFileUploaded) {
        internal = <TreeDisplay ref={opRef}> {tree}</TreeDisplay>
    }
    function handleFileSubmit(event) {
        nofificationDispatch(
            {
                type: 'ADD-NOTIFICATION',
                payload: { msg: "file uploaded successfully!", type: 'green', id: v4() }
            }
        );
        ipRef.current = event.target.files[0];
    }
    function check(text) {
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '\'') {
                return false;
            }
            else {
                return true;
            }
        }
    }
    function handleEncode(event) {
        setIsFileUploaded(true)
        var reader = new FileReader();
        reader.onload = function (event) {
            let text = event.target.result;
            if (text.length === 0) {
                nofificationDispatch(
                    {
                        type: 'ADD-NOTIFICATION',
                        payload: { msg: "Text can not be empty ! Upload another file !", type: 'red', id: v4() }
                    }
                );
                return;
            }
            if (check(text)) {
                let [encoded, tree_structure, info] = coder.encode(text);
                downloadFile(ipRef.current.name.split('.')[0] + '_encoded.txt', encoded);
                opRef.current.innerText = 'Huffman Tree : \n' + tree_structure;
                nofificationDispatch(
                    {
                        type: 'ADD-NOTIFICATION',
                        payload: { msg: info, type: 'green', id: v4() }
                    }
                );
            } else {
                alert('invalid input')
            }
        };
        reader.readAsText(ipRef.current, "UTF-8");
    }
    function handleDecode(event) {
        // drawCircles();
        setIsFileUploaded(true)
        const fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            const text = fileLoadedEvent.target.result;
            if (text.length === 0) {
                nofificationDispatch(
                    {
                        type: 'ADD-NOTIFICATION',
                        payload: { msg: "Text can not be empty ! Upload another file !", type: 'red', id: v4() }
                    }
                );
                console.log('Dispatched')
                return;
            }
            let [decoded, tree_structure, info] = coder.decode(text);
            downloadFile(ipRef.current.name.split('.')[0] + '_decoded.txt', decoded);
            opRef.current.innerText = 'Huffman Tree : \n' + tree_structure;
            nofificationDispatch(
                {
                    type: 'ADD-NOTIFICATION',
                    payload: { msg: info, type: 'green', id: v4() }
                }
            );

        };
        fileReader.readAsText(ipRef.current, "UTF-8");

    }

    return (
        // <ErrorBoundary>
        <Background>
            <Heading>HUFFMAN CODER</Heading>
            <ButtonWrapper>
                <Button onMouseMove={drawCircles} onClick={handleEncode}>ENCODE</Button>
                <Button onMouseMove={drawCircles} onClick={handleDecode}>DECODE</Button>
            </ButtonWrapper>
            <DragArea>
                {internal}
            </DragArea>
        </Background>
        // </ErrorBoundary>
    )
}

export default Zipper
