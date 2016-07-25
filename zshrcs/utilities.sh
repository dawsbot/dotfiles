# copy last command
alias copyLastCmd='fc -ln -1 | awk '{$1=$1}1' | pbcopy '

extract () {
   if [ -f $1 ] ; then
       case $1 in
           *.tar.bz2)   tar xvjf $1    ;;
           *.tar.gz)    tar xvzf $1    ;;
           *.bz2)       bunzip2 $1     ;;
           *.rar)       unrar x $1       ;;
           *.gz)        gunzip $1      ;;
           *.tar)       tar xvf $1     ;;
           *.tbz2)      tar xvjf $1    ;;
           *.tgz)       tar xvzf $1    ;;
           *.zip)       unzip $1       ;;
           *.Z)         uncompress $1  ;;
           *.7z)        7z x $1        ;;
           *)           echo "ERROR: Don't know how to extract '$1'" ;;
       esac
   else
       echo "'$1' is not a valid file!"
   fi
}

killphantom () {
  pkill -f phantom
}

printColors () {
  for x in 0 1 4 5 7 8; do for i in `seq 30 37`; do for a in `seq 40 47`; do echo -ne "\e[$x;$i;$a""m\\\e[$x;$i;$a""m\e[0;37;40m "; done; echo; done; done; echo "";
}
