console.log('hello fom client sucker')
/* eslint-disable */




export const displayMap = (locations)=>{

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2FraGE3IiwiYSI6ImNreHg1c3FiNjRidGkyeXFrMjRnamoxZWUifQ.1znh8ROPtZw0rxKhfFoBKQ';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kakha7/ckxx66hxm1vi615mu2z50s8om',
    scrollZoom: false,
    // center: [-118.333, 123.323],
    // zoom: 5,
    // interactive: false
    });
    
    
    const bounds = new mapboxgl.LngLatBounds();
    
    
    locations.forEach(loc=>{
        //create marker
    
        const el = document.createElement('div')
        el.className='marker';
    
         // add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map)
    
    
        // add popup
        new mapboxgl.Popup({
            offset:30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)
    
      // Extend map bouns to include current location
        bounds.extend(loc.coordinates)
    })
    
    
    map.fitBounds(bounds,{
        padding: {
            top: 200,
            bottom: 50,
            left:  100,
            right: 100
        }
     
    })
    }

