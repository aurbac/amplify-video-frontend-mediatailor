import React from 'react'

import Input from '@mui/material/Input';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import Paper from '@mui/material/Paper';

import { Auth, API, graphqlOperation } from 'aws-amplify';
import { createMessage } from '../graphql/mutations';
import { messagesByDate } from '../graphql/queries';
import { onCreateMessage } from '../graphql/subscriptions';

class VideoChat extends React.Component {
  
    constructor(props){
        super(props);
        this.state = {
          channel: "default",
          tmpMessage: "",
          messages: [],
          username: "",
          videoJsOptions: {
            autoplay: true,
            controls: true,
            sources: [
              {
                src: props.channelUrl,
                type: 'application/x-mpegURL',
              },
            ],
          }
        };
     }
     
    scrollToBottom = () => {
      const chat = document.getElementById("chatMessages");
      chat.scrollTop = chat.scrollHeight;
    };
    
    async componentDidMount() {
        if (this.first) return; this.first = true;
        
        const data = await Auth.currentAuthenticatedUser();
        this.setState({ username: data.username });
        
        const result = await API.graphql(graphqlOperation(messagesByDate, { channel: this.state.channel, sortDirection:'ASC' }));
        this.setState({ messages: result.data.messagesByDate.items });
        
        const createMessageListener = API.graphql(
            graphqlOperation(onCreateMessage)
        ).subscribe({
            next:  messageData => {
              const newMessage = messageData.value.data.onCreateMessage;
              if (newMessage.username!==this.state.username){
                this.setState({ messages: [...this.state.messages, newMessage ] })
                this.scrollToBottom();
              }
            },
            error: error => console.warn(error)
        });
        this.scrollToBottom();
    }
    
    componentWillUnmount() {
      
    }
    
    publishMessage = async event => {
        const input = {
          channel: this.state.channel,
          username: this.state.username,
          content: this.state.tmpMessage,
        }
        
        this.setState({ messages: [...this.state.messages, input ] })
        this.setState({ tmpMessage: "" })
        await API.graphql(graphqlOperation(createMessage, { input } ));
        this.scrollToBottom();
    };
    
    handleKeyDown = (event) => {
        if(event.target.id === "messageInput"){
          if (event.key === 'Enter') {
            this.publishMessage();
          }
        }
    };
    
    handleChangeInput = (event) => {
        this.setState({ tmpMessage: event.target.value })
    };
    
    render() {
        return (
        <div>
          <Paper square sx={{ pb: '5px' }}>
            <CardContent>
              
              <Typography variant="h5" gutterBottom component="div" sx={{ p: 1, pb: 0 }}>
                Chat
              </Typography>
              
              <List id="chatMessages" style={{height: 420, overflow: 'auto'}} >
                { this.state.messages.map((item, index)=>(
                  <ListItem key={index}>
                    <Chip label={ item.username+" : "+item.content} color={ this.state.username===item.username ? "secondary" : "primary" } />
                  </ListItem>
                ))}
              </List>
              
            </CardContent>
            <CardActions>
        
              <Input
                placeholder="Enter a message"
                fullWidth={true}
                id="messageInput"
                value={this.state.tmpMessage}
                onChange={this.handleChangeInput}
                onKeyDown={this.handleKeyDown}
                inputProps={{'aria-label': 'Message Field',}}
                autoFocus={true}
              />
              <IconButton
                color="primary"
                onClick={this.publishMessage}
                >
                <SendIcon />
              </IconButton>
            </CardActions>
          </Paper>
        </div>
    )
    }
}

export default VideoChat;