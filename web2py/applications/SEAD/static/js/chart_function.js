/**
 * Created by Lin Yu An on 12/4/16.
 */

function sumArrayElements(arr){
    // console.log('in sumArray');
    // console.log(arr);
    var arrays= arr, results= [],
        count= arrays[0].length, L= arrays.length,
        sum, next= 0, i;
    while(next<count){
        sum= 0, i= 0;
        while(i<L){
            sum+= Number(arrays[i++][next]);
        }
        results[next++]= sum;
    }
    // console.log('-done sumArray');
    return results;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}