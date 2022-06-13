//@ama let nd_root=ParseCurrentFile();console.log(JSON.stringify(nd_root,null,2));nd_root.then(require('./omp2gpu.ama.js')).Save('.audit.c')
const int SIZE = 5;
int array[SIZE];
__global__ void test_line7_parallel_for()
{
    {
        array[blockIdx.x] = blockIdx.x;
    }
}

int main()
{
    cudaMemcpy();
    test_line7_parallel_for<<<1, (SIZE - 0)>>>();
    
    return 0;
}