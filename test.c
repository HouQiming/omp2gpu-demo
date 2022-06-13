//@ama let nd_root=ParseCurrentFile();console.log(JSON.stringify(nd_root,null,2));nd_root.then(require('./omp2gpu.ama.js')).Save('.audit.c')
const int SIZE=5;
int array[SIZE];

int main()
{
    #pragma omp parallel for
    for (int i=0; i<SIZE; ++i)
    {
        array[i] = i;
    }
    return 0;
}