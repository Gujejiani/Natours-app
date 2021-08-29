class APIFeatures {
    constructor(query, queryString){
        this.query =query;
        this.queryString = queryString
    }
filter(){
    console.log('xexe')
    const queryObj = {...this.queryString}
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el=> delete queryObj[el]);

    // advanced filtering
   let queryStr = JSON.stringify(queryObj);
   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> `$${match}` )


   this.query = this.query.find(JSON.parse(queryStr))
//let query = Tour.find(JSON.parse(queryStr))  query is same as #111
   return this
}

sort(){
    console.log('xexeeee')
    if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)     // it's not javascript sort       'http://localhost:3000/api/v1/tours?sort=price' if descending order needed =-price
            // sort('price' ratingsAverage) 
    }else{
        this.query = this.query.sort('-createdAt -duration')
    }
    return this
}

limiting(){
    console.log('limit')
    //. 3) field limiting   http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price     in every case we don't need to send whole data to the client
    if(this.queryString.fields){
        const fields =  this.queryString.fields.split(',').join(' ');;
        // query = query.select('name duration price') and it only selects this tree fields and returns them                        man so damn cool 
        this.query = this.query.select(fields)
    }else{{
        this.query = this.query.select('-__v') // mongoose send __v which is generated automatically  and we add - sign -__v than  it mongoose selects everything beside __v
    }}
    return this
}

pagination(){
    console.log('pag')
      // 4) pagination  http://localhost:3000/api/v1/tours?page=2&limit=10  //skip skips results despite value of how many to skip
      const page=  this.queryString.page * 1 || 1;
      const limit =this.queryString.limit * 1 || 100;
  
       const skip = (page-1)*limit   
  
      // page=2&limit=10, 1-10, page 1, 11-20, page 2 
      this.query = this.query.skip(skip).limit(limit)
      if(this.queryString.page){
         
        //   const numTours = await Tour.countDocuments(); // return number of data   
        //   if(skip >= numTours) throw  new Error('this page doesnt exists')
      }
      return this
}

}


module.exports = APIFeatures