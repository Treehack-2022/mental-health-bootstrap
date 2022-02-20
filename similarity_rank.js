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

function find_top_therapist(database, user, ethnicity, sex_list, gender_list, weights=[1,1]){
    // language and ethnicity importance are assigned in weights
    const language_user = user["Language"];
    const ethnic_user = user["Ethnicity"];
    const area_user = user['Area'];
    var score_boost = 0;
    const candidate_names = []
    const candidate_scores = [];
    for (const [candidate, value] of Object.entries(database)) {
        var candidate_score = 0.0
        score_boost = 0
        const language_list = database[candidate]["language"];
        const ethic_list = database[candidate]["Ethnicity"];
        const area_list = database[candidate]['Area'];
        if (language_list.includes(language_user)){
            score_boost = 0.5
        }
        if (database[candidate]['Gender']===user['Gender']){
            candidate_score += weights[0]*0.5;
        }
        if (database[candidate]['specialized on topics related to sexual orientation']==='True'){
            candidate_score += weights[1]*0.5;
        }
        if (database[candidate]['specialized on topics related to immigrant'] ==='True'){
            candidate_score += weights[3]*0.5;
        }

        //console.log(weights[0]*jaccard_similarity(area_list, area_user))
        candidate_score += jaccard_similarity( area_list, area_user); // weight on area
        candidate_score += weights[2]*compute_similarity_score(ethnic_user, ethic_list, ethnicity);

        candidate_scores.push(score_boost+candidate_score);
        candidate_names.push(candidate);
    }
    for(var i=0; i<candidate_scores.length; i++){
        console.log(candidate_scores[i],candidate_names[i])
    }
    return dsu(candidate_names, candidate_scores)
}


const language = ['English','Chinese','Hindi','Spanish','Arabic','Bengali','French','Russian'];
const ethnicity = ['Asian','White ','Hispanic or Latinx','Black or African American','Middle Eastern or North African','Native Hawaiian or Pacific Islander','First Nation or Indigenous American','Mixed'];
const area = ['Anxiety/Stress','Depression','Relationship Issues','Attention/Concentration','Eating/Body Image','Trauma','Suicidal Thoughts','Alcohol and/or Other Drugs','Grief/Loss','Self Esteem/Self Confidence','Academic Issues','Identity Related Concerns','Self Harm'];
const sex_list = ['Straight/Heterosexual','Gay/Lesbian/Homosexual','Bisexual','Queer','Pansexual','Asexual','Questioning'];
const gender_list = ['Cisgender Male','Cisgeder Female','Transgender Male','Transgender Female','Nonbinary']

const therapists = require('./data2.json');
//Preference = [3,4,2,1] // rank on Gender,Sexual Orientation,Race/Ethnicity,Immigrant Status (this means that Immagrat Status > Race > Gender > Sexual orientation
const user = {'Ethnicity':['Asian'],'Area':['Anxiety/Stress', 'Depression'], 'Language':'Chinese', 'Preference':[3,4,2,1]};

const perfernce_rank = user['Preference'] // rank on Gender,Sexual Orientation,Race/Ethnicity,Immigrant Status

const weight = [1/perfernce_rank[0], 1/perfernce_rank[1], 1/perfernce_rank[2], 1/perfernce_rank[3]]
const result = find_top_therapist(therapists, user, ethnicity, sex_list, gender_list, weights=weight)

console.log(result);