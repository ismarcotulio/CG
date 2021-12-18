
async function validBracketSequence(sequence) {
    if(sequence[0] == "{" || sequence[0] == "(" || sequence[0] == "["){
        return run(sequence)
    }else{
        return false;
    }
}


function run(sequence, tokens=[], pos=0, status=true){
    if(pos == sequence.length){
        console.log(tokens)
        console.log(pos)
        return status;
    }else{
        if( sequence[pos] == "{" ){
            tokens.push(["type1", "open"])
            run(sequence, tokens, pos+1, true)
        }else{
            if( sequence[pos] == "}" ){
                tokens.push(["type1", "close"])
                run(sequence, tokens, pos+1, true)
            }else{
                if( sequence[pos] == "[" ){
                    tokens.push(["type2", "open"])
                    run(sequence, tokens, pos+1, true)
                }else{
                    if( sequence[pos] == "]" ){
                        tokens.push(["type2", "close"])
                        run(sequence, tokens, pos+1, true)
                    }else{
                        if( sequence[pos] == "(" ){
                            tokens.push(["type3", "open"])
                            run(sequence, tokens, pos+1, true)
                        }else{
                            if( sequence[pos] == ")" ){
                                tokens.push(["type3", "close"])
                                run(sequence, tokens, pos+1, true)
                            }else{
                                tokens.push(["type4", "another"])
                                run(sequence, tokens, pos+1, true)
                            }
                        }
                    }
                }
            }
        }
    }
}

console.log(validBracketSequence('{dsf{sdfs}df'));
