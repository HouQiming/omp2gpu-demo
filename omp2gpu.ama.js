module.exports=function(nd_root, options){

    let nd_main = nd_root.Find(N_FUNCTION, 'main');
    let name = nd_root.data.substring(nd_root.data.lastIndexOf('/')+1);
    name = name.substring(0, name.indexOf('.'));

    for(let nd_omp of nd_root.FindAll(N_KSTMT, '#pragma')){

        let nd_child = nd_omp.c.c;
        if (!nd_child || nd_child.node_class!=N_REF || nd_child.data!='omp')
            continue;
        let nd_child2 = nd_child.s;
        if (!nd_child2 || nd_child2.node_class!=N_REF || nd_child2.data!='parallel')
            continue;
        let nd_child3 = nd_child2.s;
        if (!nd_child3 || nd_child3.node_class!=N_REF || nd_child3.data!='for')
            continue;
        let nd_for = nd_omp.s;
        if (!nd_for || nd_for.node_class!=N_SSTMT || nd_for.data!='for')
            continue;
        
        let nd_part1 = nd_for.c.c;
        let nd_i = nd_part1.Find(N_MOV).c;
        let nd_start = nd_i.s;
        
        // todo part2: <=, > and >=
        let nd_part2 = nd_part1.s.s;
        if (nd_part2.node_class!=N_BINOP || nd_part2.data!='<')
            continue;
        let nd_end = nd_part2.c.s;
        
        // todo part3: step of loop
        let lines = nd_for.ComputeLineNumber();
        let nd_scope = nd_for.c.s;
        for(let nd_inside of nd_scope.FindAll(N_REF, nd_i.data)){
            nd_inside.data = 'blockIdx';
            let nd_tmp = nRef('tmp');
            nd_inside.ReplaceWith(nd_tmp);
            nd_tmp.ReplaceWith(nd_inside.dot('x'));
        }

        // kernel generation
        let nd_kernel = @(
            __global__ void @(nRef(name+'_line'+lines+'_parallel_for'))()
            {
                @(nd_scope)
            }
        );
        nd_main.Insert(POS_BEFORE, nd_kernel);

        // call the kernel
        nd_for.ReplaceWith(@(
            cudaMemcpy();
            @(nRef(name+'_line'+lines+'_parallel_for'))<<<1,(@(nd_end)-@(nd_start))>>>();
        ));

        nd_omp.Unlink();
    }

    return nd_root;
}