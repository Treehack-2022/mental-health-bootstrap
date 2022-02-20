function cosinesim(A,B){
    var dotproduct=0;
    var mA=0;
    var mB=0;
    var i =0;
    for(i = 0; i < A.length; i++){ // here you missed the i++
        dotproduct += (A[i] * B[i]);
        mA += (A[i]*A[i]);
        mB += (B[i]*B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    // here you needed extra brackets
    return (dotproduct) / ((mA) * (mB));
}

const dsu = (arr1, arr2) => arr1
    .map((item, index) => [arr2[index], item]) // add the args to sort by
    .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
    .map(([, item]) => item); // extract the sorted items


function compute_similarity_score(A, B, list_ref){
    const A_array = [];
    const B_array = [];

    for(var i=0; i<list_ref.length; i++){
        //console.log(list_ref[i])

        if (A.includes(list_ref[i])){
            A_array.push(1);
        } else{
            A_array.push(0);
        }
        if (B.includes(list_ref[i])){
            B_array.push(1);
        } else {
            B_array.push(0);
        }
    }
    //console.log(A_array, B_array)
    return cosinesim(A_array, B_array);
}

function jaccard_similarity(A, B){
    const union_set = new Set();
    const interset_set = new Set();
    for(var i=0; i<A.length; i++){

        union_set.add(A[i]);
        if (B.includes(A[i])){
            interset_set.add(A[i])
        }
    }
    for(i=0; i<B.length; i++){
        union_set.add(B[i])
    }
    return interset_set.size/union_set.size
}

function find_top_therapist(database, user, ethnicity, weights=[1,1]){
    // language and ethnicity importance are assigned in weights
    const language_user = user["Language"];
    const ethnic_user = user["Ethnicity"];
    const area_user = user['Area'];
    var score_boost = 0;
    const candidate_names = []
    const candidate_scores = [];
    for (const [candidate, value] of Object.entries(database)) {
        score_boost = 0
        const language_list = database[candidate]["language"];
        const ethic_list = database[candidate]["Ethnicity"];
        const area_list = database[candidate]['Area'];
        if (language_list.includes(language_user)){
            score_boost = 0.5
        }
        //console.log(weights[0]*jaccard_similarity(area_list, area_user))
        candidate_scores.push(score_boost+weights[0]*jaccard_similarity( area_list, area_user)+weights[1]*compute_similarity_score(ethnic_user, ethic_list, ethnicity))
        candidate_names.push(candidate)
    }
    const result = dsu(candidate_names, candidate_scores);
    console.log(result)
}

var array1 = [1,0,0,1];
var array2 = [1,0,0,0];

const language = ['English','Chinese','Hindi','Spanish','Arabic','Bengali','French','Russian'];
const ethnicity = ['Asian','White ','Hispanic or Latinx','Black or African American','Middle Eastern or North African','Native Hawaiian or Pacific Islander','First Nation or Indigenous American','Mixed'];
const area = ['Anxiety/Stress','Depression','Relationship Issues','Attention/Concentration','Eating/Body Image','Trauma','Suicidal Thoughts','Alcohol and/or Other Drugs','Grief/Loss','Self Esteem/Self Confidence','Academic Issues','Identity Related Concerns','Self Harm'];
const therapists = require('./data.json');
//console.log(therapists["Akane Shiro"])
const user = {'Ethnicity':['Asian'],'Area':['Anxiety/Stress', 'Depression'], 'Language':'Chinese'};

find_top_therapist(therapists, user, ethnicity, weights=[0.5,0.5])
//console.log(therapists);