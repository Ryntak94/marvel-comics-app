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

const Sidebar = (props)  =>  {
    return (
        <Container>
            <Input 
                onChange={(e) => {
                    props.setComicTitle(e.target.value)
                }}
                value={props.comicTitle}
                placeholder="Comic Title Contains"></Input>
            <Input 
                onChange={(e) => {
                    props.setComicLimit(e.target.value)
                }}
                value={props.comicLimit}
                placeholder="Limit Results"></Input>
            <Submit onClick={() =>  {
                console.log("hello")
                props.newComics()}}>Submit</Submit>
        </Container>
    )
}

export default Sidebar