import styled from 'styled-components'
const Container = styled.div`
    background-color: #101010;
    display: flex;
    flex-direction: column;
    padding-top: 1%;
    justify-content: space-around;
    padding-bottom: 42%;
`
const Input = styled.input`
    border: none;
    border-radius: 3px;
    width: 90%;
    margin: 0 auto;
`

const Submit = styled.div`
    width: 85%;
    height: 20px;
    border: solid 1px white;
    border-radius: 3px;
    margin: 0 auto;
    background-color: snow;
    display: flex;
    justify-content: center;
    align-items: center;
    :hover {
        cursor: pointer;
    }
`
const White = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: snow;
`
const Suggestions = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
`
const WhiteOption = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: snow;
    :hover {
        cursor: pointer;
    }
`

const Sidebar = (props)  =>  {
    return (
        <Container>
            <White>{'Currently case sensitive'}</White>
            <Input 
                onChange={(e) => {
                    props.setComicTitle(e.target.value)
                }}
                value={props.comicTitle}
                placeholder="Comic Title Contains"></Input>
            <Submit onClick={() =>  {
                console.log("hello")
                console.log(props.newComics())
                props.newComics({variables: {comicTitle: props.comicTitle}})}}>Submit</Submit>
            <Suggestions>
                <White>{'Suggestions:'}</White>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Spider-Man'}})}}>{'Spider-Man'}</WhiteOption>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Venom'}})}}>{'Venom'}</WhiteOption>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Iron Man'}})}}>{'Iron Man'}</WhiteOption>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Captain America'}})}}>{'Captain America'}</WhiteOption>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Captain Marvel'}})}}>{'Captain Marvel'}</WhiteOption>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Fantastic Four'}})}}>{'Fantastic Four'}</WhiteOption>
                <WhiteOption onClick={()=>{props.newComics({variables: {comicTitle: 'Hulk'}})}}>{'Hulk'}</WhiteOption>
            </Suggestions>
        </Container>
    )
}

export default Sidebar