#include <stdio.h>
#include <string.h>

int main()

{
        char word[20];
        int length;
        int i;
        int val;

        while(strcmp(word,"stop"))
         {

          printf ("Enter word to decode: ...\n");
          scanf("%s",word);

          length = strlen(word);
          val=0;

            for (i=0;i<length;i++)
               {
                val = val + (word[i]-96);
               }
          printf("Entered word is : %s\n",word);
          printf("Value for entered word is = %i\n",val);
         }

}
