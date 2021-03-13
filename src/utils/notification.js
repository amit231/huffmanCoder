import React, { useReducer, useState, useEffect, useRef, useContext } from 'react'
import styled, { keyframes } from 'styled-components'



export const NotificationContext = React.createContext('d');

const fadeIn = keyframes`
    from{
        transform:translateX(150%);

    }
    to{
        transform:translateX(0%);
    }
`
const fadeOut = keyframes`
    from{
        transform:translateX(0%);
    }
    to{
        transform:translateX(150%);
    }
`


const Background = styled.div`
    position:fixed;
    right:0;
    padding:10px;
  
`
const SingleNotification = styled.div`
    z-index:100;
    min-width:15vw;
    text-align:center;
    color:${props => props.color};
    border-radius:20px;
    padding:4px 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    padding-bottom:0px;
    background-color:yellow;
    overflow:hidden;
    font-size:2rem;
    margin:10px;
    div{
        background-color:${props => props.color};
    }
    &.fade-in{
        animation:${fadeIn} 500ms ease;
    }
    &.fade-out{
        animation:${fadeOut} 500ms ease;
    }
    @media (max-width:450px){
        font-size:1.2rem;
        padding:1px 4px;
        
    }
`
const Bar = styled.div`
    width:${props => props.width};
    height:5px;
`


function Notification(props) {
    const initialState = [{ id: '232', msg: 'hello!', type: 'red' }];
    const reducer = (state, actions) => {
        switch (actions.type) {
            case 'ADD-NOTIFICATION':
                return state.concat(actions.payload);
            case 'REMOVE-NOTIFICATION':
                return state.filter(s => s.id !== actions.payload.id)
            default:
                return state
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState)



    return (
        <NotificationContext.Provider value={dispatch}>
            <Background>
                {state.map(notification => <Single key={notification.id} noti={notification}></Single>)}
            </Background>
            {props.children}
        </NotificationContext.Provider>
    )
}


function Single(props) {
    const [exit, setExit] = useState(false);
    const [width, setWidth] = useState(0);
    const interval = useRef();
    const dispatch = useContext(NotificationContext)
    function set() {
        interval.current = setInterval(() => {
            setWidth(width => width + 2)
        }, 80)
    }
    function clear() {
        clearInterval(interval.current)
    }
    useEffect(() => {
        set()
        return () => clear();

    }, [])
    useEffect(() => {
        if (width > 100) {
            setExit(!exit)
            setTimeout(() => {
                dispatch({ type: 'REMOVE-NOTIFICATION', payload: props.noti })
            }, 100)
        }
    }, [width])

    function entered(e) {
        clear();
    }
    function exited(e) {
        set();
    }

    return (
        <SingleNotification
            onMouseEnter={entered}
            onMouseLeave={exited}
            className={exit ? 'fade-out' : 'fade-in'}
            color={props.noti.type}>
            <span>{props.noti.msg}</span>
            <Bar width={width + '%'}></Bar>
        </SingleNotification>
    )
}





export default Notification
