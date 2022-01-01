const Tour = require('../models/tourModel')

const catchAsync = require('../utils/catchAsync')

exports.getOverview =  catchAsync(async (req, res)=>{
    // 1) get tour data from collection
    const tours  = await Tour.find()
    // 2) build template

    // 3) render that template using tour data from 1

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
});


exports.getTour = catchAsync( async(req, res)=>{
    //) get the data, for the tour (including reviews and guides)
        const tour = await Tour.findOne({slug: req.params.slug}).populate({
            path:  'reviews',
            fields: 'review rating user'
        });
    //) bad template
    console.log('---------------------------------------LOG')
    console.log(req.params)
    //3) render template using data from 1)
    res.status(200).render('tour', {
        title: 'The forest hiker',
        tour: tour
    })
})