const fs = require('fs')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// so cool before sending data we check if id is valid for all routes delete and add or update by id
exports.checkID  =  (req, res, next, val)=>{
    if(val  * 1 > tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    next()
}


exports.checkAddedTour = (req, res, next)=>{
   console.log('checks')
    if(!req.body?.name || !req.body?.price){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })

    }
    console.log('yes it is valid ', req.body)

    next()
}

exports.getAllTours  =(req, res)=>{
    console.log(req.requestTime)
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
}
exports.getTour = (req, res)=>{
    console.log(req.params)
    const id = req.params.id
    const tour = tours.find(tour=> +tour.id=== +id)
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tour
        }
    })
}
exports.addTour = (req, res)=>{
    console.log(req.body)
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
        console.log(err)
    })

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
}
exports.updateTour = (req, res)=>{
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated'
        }
    })
} 

exports.deleteTour =(req, res)=>{
    const arr= 'sadsad'
    arr.
    res.status(204).json({
        status: 'success',
    
        data: {
            data: null
        }
    })
}