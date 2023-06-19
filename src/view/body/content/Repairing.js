import img_repair from '../../img/content/repair.svg';

const Repair = () => {
    return (
        <div>
            <span style={{ position: 'absolute', right: 100, top: 10, fontSize: 28, fontWeight: 'bold', color: '#858585' }}>尚未開放，近請期待</span>
            <img style={{ position: 'absolute', width: '100%', height: '100%' }} src={img_repair} alt='123'></img>
        </div>
    )
}

export default Repair;