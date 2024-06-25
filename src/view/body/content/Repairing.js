import img_repair from '../../img/content/repair.svg';

const Repair = () => {
    return (
        <div class="container-fluid" style={{ flex: 1, height: '100%', width: '100%' }}>
            <div class="row h-100">
                <span style={{ height: "5%", fontSize: 28, fontWeight: 'bold', color: '#858585' }}>尚未開放，近請期待</span>
                <img style={{ width: '100%', height: '95%', objectFit: 'contain' }} src={img_repair} alt='123'></img>
            </div>
        </div>
    )
}

export default Repair;